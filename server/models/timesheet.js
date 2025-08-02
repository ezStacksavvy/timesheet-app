const mongoose = require('mongoose');

const timesheetSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    clockIn: {
        type: String,
        required: true
    },
    clockOut: {
        type: String
    },
    project: {
        type: String
    },
    notes: {
        type: String
    },
    createdBy: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Timesheet', timesheetSchema);