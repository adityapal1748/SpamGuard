const jwt = require('jsonwebtoken');
const User = require('../models/user');
const errorResponse = require('../services/httpErrorHandler');
require('dotenv').config();  // Load environment variables from .env file

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return errorResponse(res, new Error('Access denied. No token provided.'), 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
