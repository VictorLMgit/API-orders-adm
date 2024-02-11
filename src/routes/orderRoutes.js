const express = require('express');
const router = express.Router();
const OrderController = require('./../controllers/OrderController.js');

router.get("/", OrderController.getOrders.bind(OrderController));
router.post("/", OrderController.postOrder.bind(OrderController));


module.exports = router; 