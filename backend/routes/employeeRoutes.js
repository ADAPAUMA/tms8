import express from "express";
import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  addEmployeeTask,
  updateEmployeeTask,
  deleteEmployeeTask,
} from "../controllers/employeeController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getEmployees).post(createEmployee);
router.route("/:id").get(getEmployeeById).put(updateEmployee).delete(deleteEmployee);
router.route("/:id/tasks").post(addEmployeeTask);
router.route("/:id/tasks/:taskId").put(updateEmployeeTask).delete(deleteEmployeeTask);

export default router;
