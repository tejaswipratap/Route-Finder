const mongoose = require('mongoose');

const CitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'City name is required'],
        unique: true,
        trim: true
    },
    state: {
        type: String,
        default: '',
        trim: true
    },
    posX: {
        type: Number,
        default: 100
    },
    posY: {
        type: Number,
        default: 100
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('City', CitySchema);
