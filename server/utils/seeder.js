/**
 * Database Seeder Script
 * Seeds 20 Indian Cities, Weighted Roads & Default Admin User
 */

const Admin = require('../models/Admin');
const City = require('../models/City');
const Road = require('../models/Road');

const seedSampleData = async () => {
    try {
        const cityCount = await City.countDocuments();
        if (cityCount > 0) {
            return; // Data already exists
        }

        console.log('[Seeder] Seeding sample graph data...');

        // 1. Create Default Admin
        const adminExists = await Admin.findOne({ username: 'admin' });
        if (!adminExists) {
            await Admin.create({
                username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
                password: process.env.DEFAULT_ADMIN_PASSWORD || 'admin123',
                name: process.env.DEFAULT_ADMIN_NAME || 'System Administrator'
            });
            console.log('[Seeder] Default Admin created (admin / admin123).');
        }

        // 2. Sample 20 Indian Cities with Canvas Position Coordinates (posX, posY)
        const cityList = [
            { name: 'Delhi',        state: 'Delhi',           posX: 450, posY: 150 },
            { name: 'Agra',         state: 'Uttar Pradesh',   posX: 520, posY: 240 },
            { name: 'Jaipur',       state: 'Rajasthan',       posX: 320, posY: 220 },
            { name: 'Lucknow',      state: 'Uttar Pradesh',   posX: 680, posY: 240 },
            { name: 'Kanpur',       state: 'Uttar Pradesh',   posX: 630, posY: 290 },
            { name: 'Varanasi',     state: 'Uttar Pradesh',   posX: 800, posY: 310 },
            { name: 'Chandigarh',   state: 'Punjab',          posX: 420, posY: 80 },
            { name: 'Dehradun',     state: 'Uttarakhand',     posX: 530, posY: 90 },
            { name: 'Bhopal',       state: 'Madhya Pradesh',  posX: 460, posY: 390 },
            { name: 'Indore',       state: 'Madhya Pradesh',  posX: 380, posY: 420 },
            { name: 'Ahmedabad',    state: 'Gujarat',         posX: 220, posY: 400 },
            { name: 'Mumbai',       state: 'Maharashtra',     posX: 230, posY: 560 },
            { name: 'Pune',         state: 'Maharashtra',     posX: 300, posY: 600 },
            { name: 'Nagpur',       state: 'Maharashtra',     posX: 580, posY: 460 },
            { name: 'Hyderabad',    state: 'Telangana',       posX: 520, posY: 640 },
            { name: 'Bengaluru',    state: 'Karnataka',       posX: 450, posY: 780 },
            { name: 'Chennai',      state: 'Tamil Nadu',      posX: 580, posY: 790 },
            { name: 'Kolkata',      state: 'West Bengal',     posX: 920, posY: 380 },
            { name: 'Patna',        state: 'Bihar',           posX: 820, posY: 240 },
            { name: 'Ranchi',       state: 'Jharkhand',       posX: 840, posY: 340 }
        ];

        const createdCities = await City.insertMany(cityList);
        const cityMap = new Map();
        createdCities.forEach(c => cityMap.set(c.name, c._id));

        console.log(`[Seeder] Seeded ${createdCities.length} Cities.`);

        // 3. Roads / Weighted Edges
        const roadList = [
            { source: cityMap.get('Delhi'),      destination: cityMap.get('Chandigarh'), distance: 244, roadType: 'NH 44' },
            { source: cityMap.get('Delhi'),      destination: cityMap.get('Dehradun'),   distance: 255, roadType: 'NH 334' },
            { source: cityMap.get('Delhi'),      destination: cityMap.get('Jaipur'),     distance: 280, roadType: 'NH 48' },
            { source: cityMap.get('Delhi'),      destination: cityMap.get('Agra'),       distance: 240, roadType: 'Yamuna Exp' },
            { source: cityMap.get('Chandigarh'), destination: cityMap.get('Dehradun'),   distance: 170, roadType: 'NH 7' },
            { source: cityMap.get('Jaipur'),     destination: cityMap.get('Agra'),       distance: 240, roadType: 'NH 21' },
            { source: cityMap.get('Jaipur'),     destination: cityMap.get('Indore'),     distance: 525, roadType: 'NH 52' },
            { source: cityMap.get('Agra'),       destination: cityMap.get('Lucknow'),    distance: 335, roadType: 'Agra Exp' },
            { source: cityMap.get('Agra'),       destination: cityMap.get('Kanpur'),     distance: 278, roadType: 'NH 19' },
            { source: cityMap.get('Lucknow'),    destination: cityMap.get('Kanpur'),     distance: 90,  roadType: 'NH 27' },
            { source: cityMap.get('Lucknow'),    destination: cityMap.get('Varanasi'),   distance: 320, roadType: 'NH 30' },
            { source: cityMap.get('Lucknow'),    destination: cityMap.get('Patna'),      distance: 530, roadType: 'NH 27' },
            { source: cityMap.get('Kanpur'),     destination: cityMap.get('Varanasi'),   distance: 330, roadType: 'NH 19' },
            { source: cityMap.get('Varanasi'),   destination: cityMap.get('Patna'),      distance: 250, roadType: 'NH 19' },
            { source: cityMap.get('Varanasi'),   destination: cityMap.get('Ranchi'),     distance: 360, roadType: 'NH 39' },
            { source: cityMap.get('Patna'),      destination: cityMap.get('Ranchi'),     distance: 330, roadType: 'NH 22' },
            { source: cityMap.get('Patna'),      destination: cityMap.get('Kolkata'),    distance: 580, roadType: 'NH 19' },
            { source: cityMap.get('Ranchi'),     destination: cityMap.get('Kolkata'),    distance: 400, roadType: 'NH 16' },
            { source: cityMap.get('Agra'),       destination: cityMap.get('Bhopal'),     distance: 540, roadType: 'NH 44' },
            { source: cityMap.get('Bhopal'),     destination: cityMap.get('Indore'),     distance: 190, roadType: 'State Hwy' },
            { source: cityMap.get('Bhopal'),     destination: cityMap.get('Nagpur'),     distance: 350, roadType: 'NH 46' },
            { source: cityMap.get('Indore'),     destination: cityMap.get('Ahmedabad'),  distance: 390, roadType: 'NH 47' },
            { source: cityMap.get('Ahmedabad'),  destination: cityMap.get('Mumbai'),     distance: 530, roadType: 'NH 48' },
            { source: cityMap.get('Mumbai'),     destination: cityMap.get('Pune'),       distance: 150, roadType: 'Expressway' },
            { source: cityMap.get('Pune'),       destination: cityMap.get('Hyderabad'),  distance: 560, roadType: 'NH 65' },
            { source: cityMap.get('Nagpur'),     destination: cityMap.get('Hyderabad'),  distance: 500, roadType: 'NH 44' },
            { source: cityMap.get('Nagpur'),     destination: cityMap.get('Ranchi'),     distance: 700, roadType: 'NH 53' },
            { source: cityMap.get('Hyderabad'),  destination: cityMap.get('Bengaluru'),  distance: 570, roadType: 'NH 44' },
            { source: cityMap.get('Hyderabad'),  destination: cityMap.get('Chennai'),    distance: 630, roadType: 'NH 65' },
            { source: cityMap.get('Bengaluru'),  destination: cityMap.get('Chennai'),    distance: 345, roadType: 'NH 48' },
            { source: cityMap.get('Bengaluru'),  destination: cityMap.get('Pune'),       distance: 840, roadType: 'NH 48' }
        ];

        const createdRoads = await Road.insertMany(roadList);
        console.log(`[Seeder] Seeded ${createdRoads.length} Weighted Highway Roads.`);

    } catch (err) {
        console.error('[Seeder Error]', err.message);
    }
};

module.exports = seedSampleData;
