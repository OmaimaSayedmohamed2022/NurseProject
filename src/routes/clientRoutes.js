import express from "express"
const router = express.Router()
import { createUser,updateUser ,deleteUser,getUserById,getAllUsers,getProfileCompletion, completeUserProfile} from "../controllers/clientConroller.js"
import { userValidation } from "../validations/userValidation.js"
import { userMiddleware } from "../middlewares/userMiddleware.js"
import upload from "../middlewares/uploadImage.js"


router.post("/create",userValidation(false),createUser)
router.patch("/update/:id",userMiddleware, upload.single("image"),userValidation(true),updateUser)
router.delete("/delete/:id",userMiddleware,deleteUser)
router.get("/getUser/:id",userMiddleware,getUserById)
router.get("/allUsers",getAllUsers)
router.get("/profileCompletion/:id",getProfileCompletion)
router.patch("/completeProfile/:id",upload.array("medicalFiles", 10),completeUserProfile)


export default router