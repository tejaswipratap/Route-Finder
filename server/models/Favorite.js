const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    sourceCity: {
        type: String,
        required: true
    },
    destinationCity: {
        type: String,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

FavoriteSchema.index({ sourceCity: 1, destinationCity: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', FavoriteSchema);
