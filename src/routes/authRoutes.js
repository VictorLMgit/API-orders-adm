const express = require('express');
const router = express.Router();
const AuthController = require('./../controllers/AuthController.js');


router.get("/generate" , AuthController.generateToken);


module.exports = router;