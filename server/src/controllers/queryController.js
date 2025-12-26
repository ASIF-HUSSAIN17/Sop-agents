const { searchSimilarChunks } = require('../services/searchService');

const handleQuery = async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ message: 'Query is required' });
        }

        console.log(`Received Query: "${query}"`);

        // 1. Retrieve Relevant Knowledge
        const relevantChunks = await searchSimilarChunks(query);

        console.log(`Found ${relevantChunks.length} relevant chunks`);

        // 2. Format Context for the LLM
        // We construct a structured block of text that the LLM will "read" before answering.
        const contextParts = relevantChunks.map((chunk, index) => {
            return `
[SOURCE START]
Source ID: ${index + 1}
Document: ${chunk.filename} (Page ${chunk.metadata?.pageNumber || 'N/A'})
Relevance Score: ${(chunk.score * 100).toFixed(1)}%
Content:
${chunk.text}
[SOURCE END]
            `.trim();
        });

        const fullContext = contextParts.join('\n\n');

        // 3. Return to Client 
        // (In Week 3, this will be sent to Gemini. For Week 2, we return the context)
        res.status(200).json({
            query: query,
            retrievedContext: fullContext,
            chunks: relevantChunks.map(c => ({
                filename: c.filename,
                text: c.text.substring(0, 50) + "...",
                score: c.score
            }))
        });

    } catch (error) {
        console.error("Query Handler Error:", error);
        res.status(500).json({ message: 'Error processing query', error: error.message });
    }
};

module.exports = { handleQuery };
