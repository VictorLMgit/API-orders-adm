const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController.js');

router.get("/", UserController.getUsers.bind(UserController));
router.get("/:id", UserController.getUsersByID.bind(UserController));
router.delete("/:id", UserController.deleteUser.bind(UserController));
router.put("/:id", UserController.updateUser.bind(UserController));

// API publica tem acesso apenas a criação de user
router.post("/new", UserController.postUser);

module.exports = router; 