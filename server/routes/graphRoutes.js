const express = require('express');
const router = express.Router();
const graphController = require('../controllers/graphController');
const historyController = require('../controllers/historyController');
const { protectAdmin } = require('../middleware/authMiddleware');

router.post('/find-route', graphController.findRoute);
router.post('/benchmark', graphController.benchmarkAlgorithms);
router.post('/mst', graphController.getPrimMST);

router.post('/bfs', (req, res) => { req.body.algorithm = 'BFS'; graphController.findRoute(req, res); });
router.post('/dfs', (req, res) => { req.body.algorithm = 'DFS'; graphController.findRoute(req, res); });

router.get('/data', graphController.getGraphData);
router.get('/stats', graphController.getGraphStats);
router.get('/pdf', graphController.exportPDF);

router.post('/import', protectAdmin, graphController.importGraph);
router.post('/random', protectAdmin, graphController.generateRandomGraph);

// History & Favorites
router.get('/history', historyController.getHistory);
router.get('/favorites', historyController.getFavorites);
router.post('/favorites', historyController.addFavorite);
router.delete('/favorites/:id', historyController.deleteFavorite);

module.exports = router;
