import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Task title is required"], // Added custom message
    trim: true // Added trim
  },
  dueDate: {
    type: Date,
    required: false // Changed to false, as per your frontend code
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  }
}, { timestamps: true }); // Use timestamps instead of manual createdAt

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Employee name is required"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
    lowercase: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    trim: true
  },
  tasks: [taskSchema]
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
