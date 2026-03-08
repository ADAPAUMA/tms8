import express from "express";
import {
  addDepartment,
  getAllDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.route("/").get(getAllDepartments).post(addDepartment);
router.route("/:id").put(updateDepartment).delete(deleteDepartment);

export default router;
