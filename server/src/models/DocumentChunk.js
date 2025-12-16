const mongoose = require('mongoose');

const documentChunkSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    chunkIndex: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    embedding: {
        type: [Number],
        required: true,
    },
    metadata: {
        pageNumber: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('DocumentChunk', documentChunkSchema);
