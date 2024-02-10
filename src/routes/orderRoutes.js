const express = require('express');
const router = express.Router();
const OrderController = require('./../controllers/OrderController.js');

router.get("/", OrderController.getOrders.bind(OrderController));


module.exports = router; 