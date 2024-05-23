const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/config.json")
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];


const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        // Find the user by phone number
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return errorResponse(res, new Error('Invalid phone number or password'), 400);
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return errorResponse(res, new Error('Invalid phone number or password'), 400);

        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id,phoneNumber }, envConfig.JWT_SECRET , { expiresIn: '1h' });
        
        // Return token and user data
        return successResponse(res, token);
    } catch (error) {
        return errorResponse(res, error);

    }
};

module.exports = { login };
