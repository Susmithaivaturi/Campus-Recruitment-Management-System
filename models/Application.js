const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the student user
        required: true
    },
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job', // Reference to the Job
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'Accepted', 'Rejected', 'Processing'],
        default: 'Applied' // Default status when a student applies
    },
    appliedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Application', applicationSchema);
