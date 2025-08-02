const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Timesheet = require('./models/timesheet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});

// Routes
app.get('/api/timesheets', async (req, res) => {
    try {
        const timesheets = await Timesheet.find().sort({ date: -1 });
        res.json(timesheets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/timesheets', async (req, res) => {
    try {
        const timesheet = new Timesheet(req.body);
        const newTimesheet = await timesheet.save();
        res.status(201).json(newTimesheet);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/timesheets/:id', async (req, res) => {
    try {
        const timesheet = await Timesheet.findByIdAndDelete(req.params.id);
        if (!timesheet) {
            return res.status(404).json({ message: 'Timesheet not found' });
        }
        res.json({ message: 'Timesheet deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});