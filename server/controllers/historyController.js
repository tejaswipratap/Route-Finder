const SearchHistory = require('../models/SearchHistory');
const Favorite = require('../models/Favorite');

exports.getHistory = async (req, res) => {
    try {
        const history = await SearchHistory.find().sort({ searchedAt: -1 }).limit(20);
        return res.json({ success: true, count: history.length, data: history });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find().sort({ createdAt: -1 });
        return res.json({ success: true, count: favorites.length, data: favorites });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addFavorite = async (req, res) => {
    try {
        const { sourceCity, destinationCity, notes } = req.body;
        if (!sourceCity || !destinationCity) {
            return res.status(400).json({ success: false, message: 'Source and destination cities are required.' });
        }

        const fav = await Favorite.create({
            sourceCity,
            destinationCity,
            notes: notes || ''
        });

        return res.status(201).json({ success: true, data: fav, message: 'Route added to favorites.' });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(400).json({ success: false, message: 'Route is already in favorites.' });
        }
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteFavorite = async (req, res) => {
    try {
        const { id } = req.params;
        await Favorite.findByIdAndDelete(id);
        return res.json({ success: true, message: 'Favorite route removed.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
