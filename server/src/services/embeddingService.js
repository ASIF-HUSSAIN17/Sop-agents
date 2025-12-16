const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with a placeholder if env var is missing to avoid immediate crash on require, 
// check at runtime
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "TEMP_KEY");

const generateEmbedding = async (text) => {
    try {
        // Using text-embedding-004 model for high quality embeddings
        const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
        const result = await model.embedContent(text);
        const embedding = result.embedding;
        return embedding.values;
    } catch (error) {
        console.error("Error generating embedding:", error);
        throw error;
    }
}

module.exports = { generateEmbedding };
