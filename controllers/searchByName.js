const { Op } = require('sequelize');
const User = require('../models/user');
const Contact = require('../models/contact');


const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');

const searchByName = async (req, res) => {
    const { name } = req.body;

    try {
        // First, search for contacts whose names start with the search query
        const startingWithResults = await Contact.findAll({
            where: {
                name: {
                    [Op.startsWith]: name
                }
            },
            attributes: ['name', 'phoneNumber', 'isSpam']
        });

        // Then, search for contacts whose names contain the search query but do not start with it
        const containingResults = await Contact.findAll({
            where: {
                name: {
                    [Op.like]: `%${name}%`,
                    [Op.notLike]: `${name}%`
                }
            },
            attributes: ['name', 'phoneNumber', 'isSpam']
        });

        const results = [...startingWithResults, ...containingResults];

        if (results.length === 0) {
            return errorResponse(res, new Error('No contacts found'), 404);
        }

        return successResponse(res, results, 'Contacts retrieved successfully');
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { searchByName };
