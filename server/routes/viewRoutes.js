const express = require('express');
const router = express.Router();
const City = require('../models/City');
const Road = require('../models/Road');
const SearchHistory = require('../models/SearchHistory');
const Favorite = require('../models/Favorite');
const { protectAdmin } = require('../middleware/authMiddleware');

// Home Page - Graph Visualizer
router.get('/', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        res.render('index', {
            pageTitle: 'Interactive Graph Visualizer',
            activePage: 'home',
            cities: cities
        });
    } catch (err) {
        res.render('index', {
            pageTitle: 'Interactive Graph Visualizer',
            activePage: 'home',
            cities: []
        });
    }
});

// About Page - Graph Algorithms Education
router.get('/about', (req, res) => {
    res.render('about', {
        pageTitle: 'Graph Algorithms & Time Complexity',
        activePage: 'about'
    });
});

// Route Search Page
router.get('/find-route', async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        const favorites = await Favorite.find().sort({ createdAt: -1 });
        const history = await SearchHistory.find().sort({ searchedAt: -1 }).limit(10);
        res.render('find-route', {
            pageTitle: 'Find Shortest Path',
            activePage: 'find-route',
            cities: cities,
            favorites: favorites,
            history: history
        });
    } catch (err) {
        res.render('find-route', {
            pageTitle: 'Find Shortest Path',
            activePage: 'find-route',
            cities: [],
            favorites: [],
            history: []
        });
    }
});

// Admin Login Page
router.get('/login', (req, res) => {
    res.render('login', {
        pageTitle: 'Admin Portal Login',
        activePage: 'login',
        error: req.query.error || null
    });
});

// Admin Dashboard
router.get('/admin', protectAdmin, async (req, res) => {
    try {
        const totalCities = await City.countDocuments();
        const totalRoads = await Road.countDocuments();
        const totalSearches = await SearchHistory.countDocuments();
        const recentSearches = await SearchHistory.find().sort({ searchedAt: -1 }).limit(5);

        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            activePage: 'admin-dashboard',
            admin: req.admin,
            stats: { totalCities, totalRoads, totalSearches },
            recentSearches
        });
    } catch (err) {
        res.render('admin/dashboard', {
            pageTitle: 'Admin Dashboard',
            activePage: 'admin-dashboard',
            admin: req.admin,
            stats: { totalCities: 0, totalRoads: 0, totalSearches: 0 },
            recentSearches: []
        });
    }
});

// Admin City Manager
router.get('/admin/cities', protectAdmin, async (req, res) => {
    try {
        const cities = await City.find().sort({ name: 1 });
        res.render('admin/cities', {
            pageTitle: 'Manage Cities',
            activePage: 'admin-cities',
            admin: req.admin,
            cities: cities
        });
    } catch (err) {
        res.render('admin/cities', {
            pageTitle: 'Manage Cities',
            activePage: 'admin-cities',
            admin: req.admin,
            cities: []
        });
    }
});

// Admin Road Manager
router.get('/admin/roads', protectAdmin, async (req, res) => {
    try {
        const roads = await Road.find().populate('source destination', 'name state');
        const cities = await City.find().sort({ name: 1 });
        res.render('admin/roads', {
            pageTitle: 'Manage Roads',
            activePage: 'admin-roads',
            admin: req.admin,
            roads: roads,
            cities: cities
        });
    } catch (err) {
        res.render('admin/roads', {
            pageTitle: 'Manage Roads',
            activePage: 'admin-roads',
            admin: req.admin,
            roads: [],
            cities: []
        });
    }
});

// Admin Graph Visual Editor
router.get('/admin/graph-editor', protectAdmin, async (req, res) => {
    res.render('admin/graph-editor', {
        pageTitle: 'Interactive Graph Visual Editor',
        activePage: 'admin-graph-editor',
        admin: req.admin
    });
});

module.exports = router;
