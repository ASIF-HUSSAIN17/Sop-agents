const splitText = (text, chunkSize = 1000, overlap = 100) => {
    const chunks = [];
    let start = 0;
    while (start < text.length) {
        // Calculate potential end position
        let end = start + chunkSize;

        // If we are not at the end of the text, try to break at the last space within the limit
        if (end < text.length) {
            const lastSpace = text.lastIndexOf(' ', end);
            // Verify the space is within valid range (e.g., don't go back further than 20% of chunk size to find a space)
            // or just strictly use the space if found after 'start'
            if (lastSpace > start && lastSpace > (end - 200)) {
                end = lastSpace;
            }
        }

        chunks.push(text.slice(start, end));

        // Move start forward, accounting for overlap
        // If we reached the end of text, break
        if (end >= text.length) break;

        start = end - overlap;

        // Safety check to prevent infinite loop if overlap >= chunkSize (shouldn't happen with default params)
        if (start < 0) start = 0;
    }
    return chunks;
};

module.exports = { splitText };
