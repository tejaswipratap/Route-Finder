const Road = require('../models/Road');
const City = require('../models/City');

exports.getRoads = async (req, res) => {
    try {
        const roads = await Road.find().populate('source destination', 'name state posX posY');
        return res.json({ success: true, count: roads.length, data: roads });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.addRoad = async (req, res) => {
    try {
        const { sourceId, destinationId, sourceName, destinationName, distance, roadType } = req.body;

        let srcId = sourceId;
        let destId = destinationId;

        if (!srcId && sourceName) {
            const srcCity = await City.findOne({ name: sourceName });
            if (srcCity) srcId = srcCity._id;
        }
        if (!destId && destinationName) {
            const destCity = await City.findOne({ name: destinationName });
            if (destCity) destId = destCity._id;
        }

        if (!srcId || !destId) {
            return res.status(400).json({ success: false, message: 'Valid source and destination cities are required.' });
        }

        if (srcId.toString() === destId.toString()) {
            return res.status(400).json({ success: false, message: 'Source and destination cannot be the same city.' });
        }

        const distNum = parseFloat(distance);
        if (isNaN(distNum) || distNum <= 0) {
            return res.status(400).json({ success: false, message: 'Distance must be a positive number.' });
        }

        // Check duplicate edge
        const existing = await Road.findOne({
            $or: [
                { source: srcId, destination: destId },
                { source: destId, destination: srcId }
            ]
        });

        if (existing) {
            existing.distance = distNum;
            if (roadType) existing.roadType = roadType;
            await existing.save();
            const updated = await Road.findById(existing._id).populate('source destination', 'name state');
            return res.json({ success: true, data: updated, message: 'Road distance updated successfully.' });
        }

        const road = await Road.create({
            source: srcId,
            destination: destId,
            distance: distNum,
            roadType: roadType || 'National Highway'
        });

        const populated = await Road.findById(road._id).populate('source destination', 'name state');
        return res.status(201).json({ success: true, data: populated, message: 'Road added successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.updateRoad = async (req, res) => {
    try {
        const { id } = req.params;
        const { distance, roadType } = req.body;

        const road = await Road.findById(id);
        if (!road) {
            return res.status(404).json({ success: false, message: 'Road not found.' });
        }

        if (distance) road.distance = parseFloat(distance);
        if (roadType) road.roadType = roadType;

        await road.save();
        const populated = await Road.findById(id).populate('source destination', 'name state');
        return res.json({ success: true, data: populated, message: 'Road updated successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.deleteRoad = async (req, res) => {
    try {
        const { id } = req.params;
        const road = await Road.findById(id);
        if (!road) {
            return res.status(404).json({ success: false, message: 'Road not found.' });
        }

        await road.deleteOne();
        return res.json({ success: true, message: 'Road deleted successfully.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
