// routes/user.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST route to create a user and add a shared code with a To-Do list
router.post('/addSharedCode', userController.addSharedCode);

// GET route to retrieve all users
router.get('/all', userController.getAllUsers);

// GET route to find a To-Do list by shared code
router.get('/findToDoList/:code', userController.findToDoListByCode);

// POST route to add a task to a shared code's To-Do list
router.post('/addTask', userController.addTaskToSharedCode);

module.exports = router;
