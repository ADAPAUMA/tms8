import Employee from "../models/EmployeeModel.js";

// @desc    Create a new employee
// @route   POST /api/employees
// @access  Private (e.g., Admin/Manager)
export const createEmployee = async (req, res) => {
  const { name, email, department } = req.body;
  if (!name || !email || !department) {
    return res.status(400).json({ message: "Please provide all required fields." });
  }
  try {
    const employee = await Employee.create({ name, email, department });
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private (e.g., Admin/Manager)
export const getEmployees = async (req, res) => {
  try {
    // Populate the nested tasks to include them in the response
    const employees = await Employee.find().populate("tasks");
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees." });
  }
};

// @desc    Get a single employee by ID
// @route   GET /api/employees/:id
// @access  Private (e.g., Admin/Manager)
export const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).populate("tasks");
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee.' });
  }
};

// @desc    Update an employee
// @route   PUT /api/employees/:id
// @access  Private (e.g., Admin/Manager)
export const updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an employee
// @route   DELETE /api/employees/:id
// @access  Private (e.g., Admin/Manager)
export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    res.status(200).json({ message: 'Employee deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee.' });
  }
};

// @desc    Add a new task to an employee
// @route   POST /api/employees/:id/tasks
// @access  Private (e.g., Admin/Manager)
export const addEmployeeTask = async (req, res) => {
  const { title, dueDate, status } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Task title is required." });
  }
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }
    
    const newTask = {
      title,
      dueDate,
      status: status || 'Pending',
    };
    
    employee.tasks.push(newTask);
    await employee.save();
    
    const addedTask = employee.tasks[employee.tasks.length - 1];
    res.status(201).json(addedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a specific task for an employee
// @route   PUT /api/employees/:id/tasks/:taskId
// @access  Private (e.g., Admin/Manager)
export const updateEmployeeTask = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const task = employee.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Update task fields, defaulting to current values if not provided
    task.title = req.body.title || task.title;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.status = req.body.status || task.status;
    
    await employee.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a specific task for an employee
// @route   DELETE /api/employees/:id/tasks/:taskId
// @access  Private (e.g., Admin/Manager)
export const deleteEmployeeTask = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found.' });
    }

    const task = employee.tasks.id(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    employee.tasks.pull({ _id: req.params.taskId });
    await employee.save();
    
    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete task.' });
  }
};
