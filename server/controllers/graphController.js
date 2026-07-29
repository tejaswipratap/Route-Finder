const City = require('../models/City');
const Road = require('../models/Road');
const SearchHistory = require('../models/SearchHistory');
const Graph = require('../algorithms/graph');
const Dijkstra = require('../algorithms/dijkstra');
const AStar = require('../algorithms/astar');
const BellmanFord = require('../algorithms/bellmanFord');
const PrimMST = require('../algorithms/prims');
const BFS = require('../algorithms/bfs');
const DFS = require('../algorithms/dfs');
const { generateRoutePDF } = require('../utils/pdfGenerator');

const buildGraphFromDB = async (trafficMultiplier = 1.0) => {
    const graph = new Graph(false);
    const cities = await City.find();
    const roads = await Road.find().populate('source destination');

    cities.forEach(city => {
        graph.addVertex(city.name, {
            id: city._id,
            state: city.state,
            posX: city.posX,
            posY: city.posY
        });
    });

    roads.forEach(road => {
        if (road.source && road.destination) {
            const scaledDistance = Math.round(road.distance * trafficMultiplier);
            graph.addEdge(road.source.name, road.destination.name, scaledDistance, road.roadType, road._id);
        }
    });

    return graph;
};

exports.findRoute = async (req, res) => {
    try {
        const { source, destination, waypoints = [], algorithm = 'Dijkstra', trafficMultiplier = 1.0 } = req.body;

        if (!source || !destination) {
            return res.status(400).json({ success: false, message: 'Source and destination cities are required.' });
        }

        const graph = await buildGraphFromDB(parseFloat(trafficMultiplier));
        const legNodes = [source, ...waypoints.filter(w => w && w.trim()), destination];
        let fullPath = [];
        let totalDistance = 0;
        let combinedSteps = [];
        let traversalOrder = [];

        for (let i = 0; i < legNodes.length - 1; i++) {
            const legStart = legNodes[i];
            const legEnd = legNodes[i + 1];

            let result;
            if (algorithm === 'AStar') {
                result = AStar.solve(graph, legStart, legEnd);
            } else if (algorithm === 'BellmanFord') {
                result = BellmanFord.solve(graph, legStart, legEnd);
            } else if (algorithm === 'BFS') {
                result = BFS.solve(graph, legStart, legEnd);
            } else if (algorithm === 'DFS') {
                result = DFS.solve(graph, legStart, legEnd);
            } else {
                result = Dijkstra.solve(graph, legStart, legEnd);
            }

            if (result.error || !result.path || result.path.length === 0) {
                return res.status(404).json({ success: false, message: `No path exists between ${legStart} and ${legEnd}.` });
            }

            if (i === 0) fullPath = [...result.path];
            else fullPath = [...fullPath, ...result.path.slice(1)];

            totalDistance += (result.distance || 0);
            if (result.steps) combinedSteps = [...combinedSteps, ...result.steps];
            if (result.traversalOrder) traversalOrder = [...traversalOrder, ...result.traversalOrder];
        }

        try {
            await SearchHistory.create({
                sourceCity: source,
                destinationCity: destination,
                algorithm: algorithm,
                distance: totalDistance,
                path: fullPath
            });
        } catch (err) {}

        return res.json({
            success: true,
            algorithm: algorithm,
            source: source,
            destination: destination,
            path: fullPath,
            distance: totalDistance,
            traversalOrder: traversalOrder,
            steps: combinedSteps
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getPrimMST = async (req, res) => {
    try {
        const { startNode } = req.body;
        const graph = await buildGraphFromDB();
        const result = PrimMST.solve(graph, startNode);

        return res.json({
            success: true,
            algorithm: 'PrimMST',
            mstEdges: result.mstEdges,
            totalWeight: result.totalWeight,
            steps: result.steps
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.benchmarkAlgorithms = async (req, res) => {
    try {
        const { source, destination, trafficMultiplier = 1.0 } = req.body;
        if (!source || !destination) {
            return res.status(400).json({ success: false, message: 'Source and destination cities are required.' });
        }

        const graph = await buildGraphFromDB(parseFloat(trafficMultiplier));
        const algorithms = ['Dijkstra', 'AStar', 'BellmanFord', 'BFS', 'DFS'];
        const benchmarkResults = [];

        algorithms.forEach(algo => {
            const startTime = process.hrtime();
            let resObj;

            if (algo === 'AStar') resObj = AStar.solve(graph, source, destination);
            else if (algo === 'BellmanFord') resObj = BellmanFord.solve(graph, source, destination);
            else if (algo === 'BFS') resObj = BFS.solve(graph, source, destination);
            else if (algo === 'DFS') resObj = DFS.solve(graph, source, destination);
            else resObj = Dijkstra.solve(graph, source, destination);

            const diff = process.hrtime(startTime);
            const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(3);

            benchmarkResults.push({
                algorithm: algo,
                path: resObj.path || [],
                distance: resObj.distance || 0,
                nodesExplored: resObj.steps ? resObj.steps.length : 0,
                executionTimeMs: parseFloat(executionTimeMs)
            });
        });

        return res.json({ success: true, benchmarks: benchmarkResults });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.exportPDF = (req, res) => {
    const { source, destination, distance, path, algorithm } = req.query;
    const pathArr = path ? path.split(',') : [];

    const routeData = {
        source: source || 'N/A',
        destination: destination || 'N/A',
        distance: distance || '0',
        path: pathArr,
        algorithm: algorithm || 'Dijkstra'
    };

    generateRoutePDF(res, routeData);
};

exports.getGraphData = async (req, res) => {
    try {
        const graph = await buildGraphFromDB();
        return res.json({ success: true, data: graph.exportJSON() });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.getGraphStats = async (req, res) => {
    try {
        const graph = await buildGraphFromDB();
        const vertices = graph.getVertices();
        const edges = graph.getAllEdges();
        const V = vertices.length;
        const E = edges.length;
        const density = V > 1 ? ((2 * E) / (V * (V - 1))).toFixed(4) : 0;

        return res.json({
            success: true,
            stats: {
                totalCities: V,
                totalRoads: E,
                density: parseFloat(density),
                avgDegree: V > 0 ? ((2 * E) / V).toFixed(2) : 0
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.importGraph = async (req, res) => {
    try {
        const { vertices, edges } = req.body;
        if (!Array.isArray(vertices) || !Array.isArray(edges)) {
            return res.status(400).json({ success: false, message: 'Invalid JSON format.' });
        }

        await City.deleteMany({});
        await Road.deleteMany({});

        const cityDocs = vertices.map(v => ({
            name: v.name,
            state: v.state || '',
            posX: v.posX || 100,
            posY: v.posY || 100
        }));

        const createdCities = await City.insertMany(cityDocs);
        const cityMap = new Map();
        createdCities.forEach(c => cityMap.set(c.name, c._id));

        const roadDocs = [];
        edges.forEach(e => {
            if (cityMap.has(e.source) && cityMap.has(e.destination)) {
                roadDocs.push({
                    source: cityMap.get(e.source),
                    destination: cityMap.get(e.destination),
                    distance: e.weight || e.distance || 100,
                    roadType: e.roadType || 'Highway'
                });
            }
        });

        await Road.insertMany(roadDocs);

        return res.json({
            success: true,
            message: `Graph imported successfully! ${createdCities.length} cities and ${roadDocs.length} roads created.`
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.generateRandomGraph = async (req, res) => {
    try {
        const numNodes = parseInt(req.body.numNodes) || 10;
        const numEdges = parseInt(req.body.numEdges) || 15;

        await City.deleteMany({});
        await Road.deleteMany({});

        const cities = [];
        for (let i = 1; i <= numNodes; i++) {
            cities.push({
                name: `City_${i}`,
                state: `State_${Math.ceil(i / 3)}`,
                posX: Math.floor(Math.random() * 700) + 50,
                posY: Math.floor(Math.random() * 450) + 50
            });
        }
        const createdCities = await City.insertMany(cities);

        const roads = [];
        const edgeSet = new Set();
        let attempts = 0;

        while (roads.length < numEdges && attempts < numEdges * 10) {
            attempts++;
            const idx1 = Math.floor(Math.random() * numNodes);
            let idx2 = Math.floor(Math.random() * numNodes);
            if (idx1 === idx2) continue;

            const edgeKey = [idx1, idx2].sort().join('-');
            if (edgeSet.has(edgeKey)) continue;

            edgeSet.add(edgeKey);
            roads.push({
                source: createdCities[idx1]._id,
                destination: createdCities[idx2]._id,
                distance: Math.floor(Math.random() * 450) + 50,
                roadType: 'Highway'
            });
        }

        await Road.insertMany(roads);

        return res.json({
            success: true,
            message: `Generated Random Graph with ${numNodes} Cities and ${roads.length} Roads.`
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
