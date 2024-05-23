const Joi = require('joi');
const Contact = require('../models/contact');
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

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
