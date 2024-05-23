const Joi = require('joi');
const Contact = require("../models/contact");
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

// Joi schema for request validation
const markAsSpamSchema = Joi.object({
    phoneNumber: Joi.string().required().trim().min(10).max(15).pattern(/^\d+$/)
});

const markAsSpam = async (req, res) => {
    try {
        // Validate request body
        const { error } = markAsSpamSchema.validate(req.body);
        if (error) {
            return errorResponse(res, new Error(error.details[0].message), 400);
        }

        const { phoneNumber } = req.body;

        // Find the contact by phone number
        const contact = await Contact.findOne({ where: { phoneNumber } });
        if (!contact) {
            return errorResponse(res, new Error('Contact not found'), 404);
        }

        if (contact.isSpam) {
            return errorResponse(res, new Error('Number already marked as spam'), 400);
        }

        // Mark the contact as spam
        await contact.update({ isSpam: 1 });

        return successResponse(res, null, 'Contact marked as spam', 200);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { markAsSpam };
