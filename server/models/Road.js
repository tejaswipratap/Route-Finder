const mongoose = require('mongoose');

const RoadSchema = new mongoose.Schema({
    source: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'City',
        required: true
    },
    distance: {
        type: Number,
        required: [true, 'Distance in KM is required'],
        min: [1, 'Distance must be at least 1 KM']
    },
    roadType: {
        type: String,
        default: 'National Highway'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure unique bidirectional pairs
RoadSchema.index({ source: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model('Road', RoadSchema);
