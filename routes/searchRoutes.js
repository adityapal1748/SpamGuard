const express = require('express');
const { searchByName } = require('../controllers/searchByName');
const { searchByPhone } = require('../controllers/searchByPhone');
const { getContactDetails } = require('../controllers/detailedSearch');
const authenticate = require('../middleware/authMiddleware');
const router = express.Router();

// router.post('/register', authController.register);
router.post('/searchByName',authenticate,(req,res) =>{
    searchByName(req,res)
});
router.post('/searchByPhone',authenticate,(req,res) =>{
    searchByPhone(req,res)
});
router.post('/detailedSearch',authenticate,(req,res) =>{
    getContactDetails(req,res)
});


module.exports = router;