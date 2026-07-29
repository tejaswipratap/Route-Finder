const City = require('../models/City');
const Road = require('../models/Road');

exports.getCities = async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        return res.json({ success: true, count: cities.length, data: cities });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addCity = async (req, res) => {
    try {
        const { name, state, posX, posY } = req.body;
        if (!name) {
            return res.status(400).json({ success: false, message: 'City name is required.' });
        }

        const existing = await City.findOne({ name: name.trim() });
        if (existing) {
            return res.status(400).json({ success: false, message: 'City already exists.' });
        }

        const city = await City.create({
            name: name.trim(),
            state: state || '',
            posX: posX || Math.floor(Math.random() * 600) + 100,
            posY: posY || Math.floor(Math.random() * 400) + 100
        });

        return res.status(201).json({ success: true, data: city, message: 'City added successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateCity = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, state, posX, posY } = req.body;

        const city = await City.findById(id);
        if (!city) {
            return res.status(404).json({ success: false, message: 'City not found.' });
        }

        if (name) city.name = name.trim();
        if (state !== undefined) city.state = state.trim();
        if (posX !== undefined) city.posX = posX;
        if (posY !== undefined) city.posY = posY;

        await city.save();
        return res.json({ success: true, data: city, message: 'City updated successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteCity = async (req, res) => {
    try {
        const { id } = req.params;
        const city = await City.findById(id);
        if (!city) {
            return res.status(404).json({ success: false, message: 'City not found.' });
        }

        // Delete connected roads
        await Road.deleteMany({ $or: [{ source: id }, { destination: id }] });
        await city.deleteOne();

        return res.json({ success: true, message: 'City and connected roads deleted successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
