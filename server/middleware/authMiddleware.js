const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protectAdmin = async (req, res, next) => {
    let token = null;

    if (req.cookies && req.cookies.admin_token) {
        token = req.cookies.admin_token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Admin token required.' });
        }
        return res.redirect('/login?error=unauthorized');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret_jwt_key_routefinder_2026_university_pep');
        req.admin = await Admin.findById(decoded.id).select('-password');
        
        if (!req.admin) {
            return res.status(401).json({ success: false, message: 'Invalid token user.' });
        }

        next();
    } catch (err) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
            return res.status(401).json({ success: false, message: 'Token expired or invalid.' });
        }
        return res.redirect('/login?error=expired');
    }
};

module.exports = { protectAdmin };
