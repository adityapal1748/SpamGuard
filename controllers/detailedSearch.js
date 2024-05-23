const Joi = require('joi');
const Contact = require("../models/contact");
const User = require("../models/user");
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

// Define Joi schema for the request body
const schema = Joi.object({
    person: Joi.number().required()
});

const getContactDetails = async (req, res) => {
    try {
        // Validate request body
        const { error, value } = schema.validate(req.body);
        if (error) {
            throw new Error(error.details[0].message);
        }

        const { person } = value; // ID of the contact being searched for
        const searchingUserPhoneNumber = req.user.phoneNumber; // Phone number from the authenticated user

        const contact = await Contact.findByPk(person); // Fetch the contact by ID

        if (!contact) {
            return errorResponse(res, new Error('Contact not found'), 404);
        }

        // Fetch the registered user (contact owner) by the contact's phone number
        const contactOwner = await User.findOne({
            where: { phoneNumber: contact.phoneNumber }
        });

        if (!contactOwner) {
            return errorResponse(res, new Error('Contact owner not found'), 404);
        }

        // Check if the searching user is in the contact owner's contact list
        const isInContactList = await Contact.findOne({
            where: {
                userId: contactOwner.id,
                phoneNumber: searchingUserPhoneNumber
            }
        });

        const contactDetails = {
            name: contact.name,
            phoneNumber: contact.phoneNumber,
            isSpam: contact.isSpam
        };

        if (isInContactList) {
            contactDetails.email = contactOwner.email;
        }

        return successResponse(res, contactDetails);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { getContactDetails };
