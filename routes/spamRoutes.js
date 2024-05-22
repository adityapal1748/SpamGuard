const express = require('express');
const { markAsSpam } = require('../controllers/markAsSpam');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// router.post('/register', authController.register);
router.post('/markAsSpam',authenticate,(req,res) =>{
    markAsSpam(req,res)
});

module.exports = router;