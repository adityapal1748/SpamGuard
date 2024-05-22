const jwt = require('jsonwebtoken');
const config = require('../config/config.json');
const User = require('../models/user');
const errorResponse = require('../services/httpErrorHandler');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return errorResponse(res, new Error('Access denied. No token provided.'), 401);
    }

    try {
        const decoded = jwt.verify(token, config.development.JWT_SECRET);
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return errorResponse(res, new Error('Invalid token.'), 401);
        }
        req.user = user;
        next();
    } catch (error) {
        return errorResponse(res, new Error('Invalid token.'), 401);
    }
};

module.exports = authenticate;
