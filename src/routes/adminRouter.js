import express from "express";
import { getAdminById,updateEmployeePermissions,
    createEmployee,updateEmployee,deleteEmployee,getAllEmployees
} from "../controllers/adminController.js";
import { verifyToken,authorizeRole } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadImage.js"

const router = express.Router();


router.get("/getById/:id",getAdminById)
router.put("/permissions/:id", verifyToken, authorizeRole(["Admin"]), updateEmployeePermissions);

router.post("/creatEmployee", upload.single("image"), createEmployee);
router.put("/updateEmployee/:id",upload.single("image") ,updateEmployee);
router.delete("/deleteEmployee/:id", deleteEmployee);
router.get("/getAllEmployee", getAllEmployees);


export default router;
