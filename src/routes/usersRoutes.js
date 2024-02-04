const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController.js');


router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUsersByID);
router.delete("/:id", UserController.deleteUser);
router.put("/:id", UserController.updateUser);
router.post("/new", UserController.postUser);

module.exports = router; 