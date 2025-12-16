require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const ingestRoutes = require('./routes/ingestRoutes');

// Connect to Database
if (process.env.MONGODB_URI && process.env.MONGODB_URI !== 'your_mongodb_connection_string') {
    connectDB();
} else {
    console.log("MongoDB URI not set or is default, skipping DB connection");
}

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('OpsMind AI API is running...');
});

// Routes
app.use('/api', ingestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
