const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();

// Body parser & Security Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors());

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'client/public')));

// Configure EJS Templating Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'client/views'));

// Mount API & View Routes
app.use('/api/auth', require('./server/routes/authRoutes'));
app.use('/api/city', require('./server/routes/cityRoutes'));
app.use('/api/road', require('./server/routes/roadRoutes'));
app.use('/api', require('./server/routes/graphRoutes'));
app.use('/', require('./server/routes/viewRoutes'));

// 404 Handler
app.use((req, res, next) => {
    res.status(404).render('index', {
        pageTitle: 'Page Not Found',
        activePage: '404',
        cities: []
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('[Global Error]', err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

module.exports = app;
