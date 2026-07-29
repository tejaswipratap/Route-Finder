const mongoose = require('mongoose');

const SearchHistorySchema = new mongoose.Schema({
    sourceCity: {
        type: String,
        required: true
    },
    destinationCity: {
        type: String,
        required: true
    },
    algorithm: {
        type: String,
        required: true,
        enum: ['Dijkstra', 'BFS', 'DFS']
    },
    distance: {
        type: Number,
        default: 0
    },
    path: {
        type: [String],
        default: []
    },
    searchedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SearchHistory', SearchHistorySchema);
