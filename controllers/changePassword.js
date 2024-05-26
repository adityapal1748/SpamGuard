const bcrypt = require('bcrypt');
const User = require('../models/user');
const successResponse = require('../services/httpResponseHandler');
const errorResponse = require('../services/httpErrorHandler');
const Joi = require('joi');

const changePasswordSchema = Joi.object({
    oldPassword: Joi.string().required().trim().min(6),
    newPassword: Joi.string().required().trim().min(6)
});

// Controller for changing password
const changePassword = async (req, res) => {
    try {
        // Validate request body
        const { error } = changePasswordSchema.validate(req.body);
        if (error) {
            return errorResponse(res, new Error(error.details[0].message), 400);
        }

        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Assuming user ID is stored in req.user after authentication middleware

        // Find the user by ID
        const user = await User.findByPk(userId);
        if (!user) {
            return errorResponse(res, new Error('User not found'), 404);
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return errorResponse(res, new Error('Old password is incorrect'), 400);
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        await user.update({ password: hashedNewPassword });

        return successResponse(res, null, 'Password changed successfully', 200);
    } catch (error) {
        return errorResponse(res, error);
    }
};

module.exports = { changePassword };
