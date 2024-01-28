const express = require('express');
const router = express.Router();
const UserController = require('./../controllers/UserController.js');


router.get("/", UserController.getUsers);
router.get("/:id", UserController.getUsersByID);

router.post("/new", UserController.postUser);

module.exports = router; 