import Department from "../models/departmentModel.js";

// @desc    Add a new department
// @route   POST /api/departments
// @access  Private (e.g., Admin)
export const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const newDepartment = new Department({ name });
    await newDepartment.save();
    res.status(201).json(newDepartment);
  } catch (error) {
    console.error("Error adding department:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private (e.g., Admin)
export const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error getting departments:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// @desc    Update a department by ID
// @route   PUT /api/departments/:id
// @access  Private (e.g., Admin)
export const updateDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Department name is required." });
    }

    const department = await Department.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true, runValidators: true } // Return the updated document and run schema validators
    );
    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }
    res.status(200).json(department);
  } catch (error) {
    console.error("Error updating department:", error.message);
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a department by ID
// @route   DELETE /api/departments/:id
// @access  Private (e.g., Admin)
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      return res.status(404).json({ message: "Department not found." });
    }
    res.status(200).json({ message: "Department deleted successfully." });
  } catch (error) {
    console.error("Error deleting department:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
