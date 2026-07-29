const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'supersecret_jwt_key_routefinder_2026_university_pep', {
        expiresIn: '1d'
    });
};

exports.loginAdmin = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username and password are required.' });
        }

        const admin = await Admin.findOne({ username: username.toLowerCase() });
        if (admin && (await admin.matchPassword(password))) {
            const token = generateToken(admin._id);

            // Set HTTP-Only Cookie
            res.cookie('admin_token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });

            return res.json({
                success: true,
                token: token,
                admin: {
                    id: admin._id,
                    username: admin.username,
                    name: admin.name
                },
                message: 'Admin authentication successful.'
            });
        }

        return res.status(401).json({ success: false, message: 'Invalid username or password.' });
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

exports.logoutAdmin = (req, res) => {
    res.clearCookie('admin_token');
    return res.json({ success: true, message: 'Admin logged out successfully.' });
};

exports.getMe = (req, res) => {
    return res.json({ success: true, admin: req.admin });
};
