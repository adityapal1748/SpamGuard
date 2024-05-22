const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require("../config/config.json")
const env = process.env.NODE_ENV || 'development';
const envConfig = config[env];

const login = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        // Find the user by phone number
        const user = await User.findOne({ where: { phoneNumber } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid phone number or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id,phoneNumber }, envConfig.JWT_SECRET , { expiresIn: '1h' });
        
        // Return token and user data
        return res.json({ token, user });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { login };
