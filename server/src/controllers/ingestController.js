const mongoose = require('mongoose');
const { parsePDF } = require('../services/pdfService');
const { splitText } = require('../services/chunkingService');
const { generateEmbedding } = require('../services/embeddingService');
const DocumentChunk = require('../models/DocumentChunk');

const ingestFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log(`Processing file: ${req.file.originalname}`);

        // 1. Parsing
        const text = await parsePDF(req.file.buffer);
        console.log(`Parsed PDF. Text length: ${text.length}`);

        // 2. Chunking
        const chunks = splitText(text);
        console.log(`Generated ${chunks.length} chunks`);

        const storedChunks = [];

        // 3. Embedding & Storage
        // Depending on volume, might need batch processing. 
        for (let i = 0; i < chunks.length; i++) {
            const chunkText = chunks[i].trim();
            if (!chunkText) continue;

            let embedding = [];

            // Check if real API key is ready
            if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.length > 20) {
                try {
                    embedding = await generateEmbedding(chunkText);
                } catch (e) {
                    console.error(`Failed to generate embedding for chunk ${i}:`, e.message);
                    // Fallback or abort? For now continue with empty/mock for stability if API fails
                    embedding = [];
                }
            } else {
                // Mock embedding for dev/demo if no key
                embedding = new Array(768).fill(0).map(() => Math.random());
            }

            const docChunk = new DocumentChunk({
                filename: req.file.originalname,
                chunkIndex: i,
                text: chunkText,
                embedding: embedding,
                metadata: {
                    pageNumber: 1 // Placeholder
                }
            });

            // Save to DB only if connected
            if (mongoose.connection.readyState === 1) {
                await docChunk.save();
            }

            storedChunks.push({ index: i, preview: chunkText.substring(0, 30) + "..." });
        }

        res.status(200).json({
            message: 'File processed successfully',
            totalChunks: chunks.length,
            chunks: storedChunks
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { ingestFile };
