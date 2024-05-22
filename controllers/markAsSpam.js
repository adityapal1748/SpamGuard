const Contact = require("../models/contact");
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

const markAsSpam = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        // Find the contact by phone number
        const contact = await Contact.findOne({ where: { phoneNumber } });
        if (!contact) {
            return errorResponse(res, new Error('Contact not found'), 404);
        }
        console.log(contact)

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
