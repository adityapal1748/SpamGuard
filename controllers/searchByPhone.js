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

        // Extract the user ID from the authenticated user (assuming req.user is set by the authentication middleware)
        const userId = req.user.id;

        const registeredUser = await User.findOne({ where: { phoneNumber } });

        if (registeredUser) {
            // Check if the searching user is in the contact list of the registered user
            const contact = await Contact.findOne({ where: { userId: registeredUser.id, phoneNumber: req.user.phoneNumber } });

            if (contact) {
                // If the searching user is in the contact list of the registered user, return the email as well
                return successResponse(res, {
                    name: registeredUser.name,
                    phoneNumber: registeredUser.phoneNumber,
                    email: registeredUser.email,
                    isSpam: false  // Registered users are not marked as spam by default
                });
            } else {
                // If the searching user is not in the contact list, return details without email
                return successResponse(res, {
                    name: registeredUser.name,
                    phoneNumber: registeredUser.phoneNumber,
                    isSpam: false  // Registered users are not marked as spam by default
                });
            }
        }

        // If no registered user is found, return contacts from the Contact table
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
