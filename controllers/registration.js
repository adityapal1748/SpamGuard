const bcrypt = require('bcrypt');
const User = require('../models/user');
const Joi = require('joi');

const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

// Joi schema for request validation
const registerSchema = Joi.object({
    name: Joi.string().required().trim(),
    phoneNumber: Joi.string().required().trim().min(10).max(15).pattern(/^\d+$/),
    password: Joi.string().required().trim().min(6),
    email: Joi.string().email().required().trim()
});

const register = async (req, res) => {
    try {
        // Validate request body
        // const { error } = registerSchema.validate(req.body);
        // if (error) {
        //     return errorResponse(res, new Error(error.details[0].message), 400);
        // }

        const { name, phoneNumber, password, email } = req.body;

        // Check if the phone number is already registered
        const existingUser = await User.findOne({ where: { phoneNumber } });
        if (existingUser) {
            return errorResponse(res, new Error('Phone number already registered'), 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = await User.create({
            name,
            phoneNumber,
            password: hashedPassword,
            email
        });

        // Return the newly created user's name
        return successResponse(res, newUser.name, 'User registered successfully', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { register };
