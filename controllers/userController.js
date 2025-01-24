// controllers/userController.js
const User = require('../models/user');

// Controller to add a shared code with a To-Do list
exports.addSharedCode = async (req, res) => {
    const { name, dateOfBirth, partnerName, code, task } = req.body;
  
    // Ensure that the required fields are present, but task is optional
    if (!name || !dateOfBirth || !partnerName || !code) {
      return res.status(400).json({ message: 'All fields except task are required' });
    }
  
    try {
      // Check if user exists
      let user = await User.findOne({ name });
      if (!user) {
        // If the user doesn't exist, create a new one without any shared codes
        user = new User({ name, dateOfBirth, partnerName, sharedCodes: [] });
      }
  
      // Check if the shared code already exists
      const existingCode = user.sharedCodes.find(sc => sc.code === code);
      if (existingCode) {
        return res.status(400).json({ message: 'Shared code already exists' });
      }
  
      // Prepare the shared code object
      const sharedCode = {
        code,
        owner: name,
        partnerName,
        dateOfBirth,
        toDoList: [],
      };
  
      // If a task is provided, add it to the toDoList
      if (task) {
        sharedCode.toDoList.push({ task, completed: false });
      }
  
      // Add the shared code to the user's shared codes array
      user.sharedCodes.push(sharedCode);
  
      // Save the user data
      await user.save();
      res.status(201).json({ message: 'Shared code and To-Do list added successfully', user });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Error adding shared code and To-Do list' });
    }
  };
// Controller to get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Controller to find a To-Do list by shared code
exports.findToDoListByCode = async (req, res) => {
  const { code } = req.params;

  try {
    const user = await User.findOne({ 'sharedCodes.code': code });
    if (!user) {
      return res.status(404).json({ message: 'Shared code not found' });
    }

    const sharedCode = user.sharedCodes.find(sc => sc.code === code);
    if (!sharedCode) {
      return res.status(404).json({ message: 'Shared code not found in user data' });
    }

    res.status(200).json({ toDoList: sharedCode.toDoList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching To-Do list by shared code' });
  }
};

// Controller to add a task to a shared code's To-Do list
exports.addTaskToSharedCode = async (req, res) => {
  const { code, task } = req.body;

  if (!code || !task) {
    return res.status(400).json({ message: 'Shared code and task are required' });
  }

  try {
    const user = await User.findOne({ 'sharedCodes.code': code });
    if (!user) {
      return res.status(404).json({ message: 'Shared code not found' });
    }

    const sharedCode = user.sharedCodes.find(sc => sc.code === code);
    if (!sharedCode) {
      return res.status(404).json({ message: 'Shared code not found in user data' });
    }

    // Add task to the To-Do list
    sharedCode.toDoList.push({ task, completed: false });

    await user.save();
    res.status(201).json({ message: 'Task added successfully', toDoList: sharedCode.toDoList });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding task to To-Do list' });
  }
};
