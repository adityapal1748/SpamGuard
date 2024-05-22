const bcrypt = require('bcrypt');
const User = require('../models/user');

const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');



const register = async (req, res) => {
    const { name, phoneNumber, password, email } = req.body;
    try {
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

        // Return the newly created user
        return successResponse(res, newUser, 'User registered successfully', 201);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { register };

