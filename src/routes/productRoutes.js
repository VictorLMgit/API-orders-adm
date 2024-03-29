const express = require('express');
const router = express.Router();
const ProductController = require('./../controllers/ProductController.js');


router.get("/", ProductController.getProducts.bind(ProductController));
router.get("/:id", ProductController.getProduct.bind(ProductController));
router.post("/", ProductController.postProduct.bind(ProductController));
router.put("/:id", ProductController.updateProduct.bind(ProductController));
router.delete("/:id", ProductController.deleteProduct.bind(ProductController));


module.exports = router; 