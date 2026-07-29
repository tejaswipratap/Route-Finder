/**
 * Route Finder - Shortest Path Visualizer
 * Server Entrypoint
 */

require('dotenv').config();
const app = require('./app');
const connectDB = require('./server/config/db');

const PORT = process.env.PORT || 3000;

// Connect Database & Start HTTP Listener
const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`
============================================================
 ROUTE FINDER - SHORTEST PATH VISUALIZER
 Server active at: http://localhost:${PORT}
 Environment:     ${process.env.NODE_ENV || 'development'}
============================================================
        `);
    });
};

startServer();
