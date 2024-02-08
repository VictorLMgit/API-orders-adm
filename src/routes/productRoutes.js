const express = require('express');
const router = express.Router();
const ProductController = require('./../controllers/ProductController.js');


router.get("/", ProductController.getProducts.bind(ProductController));


module.exports = router; 