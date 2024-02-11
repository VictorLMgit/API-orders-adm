const express = require('express');
const router = express.Router();
const OrderController = require('./../controllers/OrderController.js');

router.get("/", OrderController.getOrders.bind(OrderController));
router.get("/:id", OrderController.getOrder.bind(OrderController));
router.post("/", OrderController.postOrder.bind(OrderController));
router.put("/:id", OrderController.updateOrder.bind(OrderController));
router.delete("/:id", OrderController.deleteOrder.bind(OrderController));


module.exports = router; 