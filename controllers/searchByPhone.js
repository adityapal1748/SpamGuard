const Joi = require('joi');
const Contact = require('../models/contact');
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');
const User = require('../models/user');

// Define Joi schema for the request body
const schema = Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]+$/).required().messages({
        'string.base': 'Phone number must be a string',
        'string.pattern.base': 'Phone number must contain only digits',
        'any.required': 'Phone number is required'
    })
});

const searchByPhone = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { phoneNumber } = value;

        const registeredUser = await User.findOne({ where: { phoneNumber } });

        if (registeredUser) {
            // If registered user is found, return only that user's details
            return successResponse(res, {
                name: registeredUser.name,
                phoneNumber: registeredUser.phoneNumber,
                email: registeredUser.email,
                isSpam: false  // Registered users are not marked as spam by default
            });
        }

        const results = await Contact.findAll({
            where: { phoneNumber }
        });

        if (results.length === 0) {
            return errorResponse(res, new Error('No contacts found'), 404);
        }
        return successResponse(res, results);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { searchByPhone };
