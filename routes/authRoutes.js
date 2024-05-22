const express = require('express');
const { register } = require('../controllers/registration');
const { login } = require('../controllers/login');
const router = express.Router();

// router.post('/register', authController.register);
router.post('/login',(req,res) =>{
    login(req,res)
});
router.post("/registration",(req,res) =>{
    register(req,res)
})

module.exports = router;