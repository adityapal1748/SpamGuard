const Contact = require('../models/contact');

const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

const searchByPhone = async (req, res) => {
    const { phoneNumber } = req.body;
    try {
        const results = await Contact.findAll({
            where: { phoneNumber }
        });

        if (results.length === 0) {
            return errorResponse(res, new Error('No contacts found'), 404);
        }
        return successResponse(res, results);
    } catch (error) {
        return errorResponse(res,error)
    }
};

module.exports = { searchByPhone };
