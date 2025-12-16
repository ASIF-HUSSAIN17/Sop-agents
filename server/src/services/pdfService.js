const pdf = require('pdf-parse');

const parsePDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        throw new Error('Error parsing PDF: ' + error.message);
    }
};

module.exports = { parsePDF };
