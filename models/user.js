// models/user.js
const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  partnerName: {
    type: String,
    required: true,
  },
  sharedCodes: [
    {
      code: {
        type: String,
        required: true,
        unique: true, // ensure unique code for each pair
      },
      owner: {
        type: String,
        required: true,
      },
      partnerName: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      toDoList: [
        {
          task: {
            type: String,
            required: false,
          },
          completed: {
            type: Boolean,
            default: false,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model('User', userSchema);
