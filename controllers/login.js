const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/config.json");
const Joi = require('joi');

const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

// Joi schema for request validation
const loginSchema = Joi.object({
    phoneNumber: Joi.string().required().trim().min(10).max(15).pattern(/^\d+$/),
    password: Joi.string().required().trim().min(6)
});

const login = async (req, res) => {
    try {
        // Validate request body
        const { error } = loginSchema.validate(req.body);
        if (error) {
            return errorResponse(res, new Error(error.details[0].message), 400);
        }

        const { phoneNumber, password } = req.body;

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
        const token = jwt.sign({ id: user.id, phoneNumber }, envConfig.JWT_SECRET, { expiresIn: '1h' });
        
        // Return token
        return successResponse(res, token);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { login };
