import express from "express"
const router = express.Router()
import { createUser,updateUser ,deleteUser,getUserById,getAllUsers} from "../controllers/sickConroller.js"
import { userValidation } from "../validations/userValidation.js"
import { userMiddleware } from "../middlewares/userMiddleware.js"


router.post("/create",userValidation(false),createUser)
router.patch("/update/:id",userMiddleware,userValidation(true),updateUser)
router.delete("/delete/:id",userMiddleware,deleteUser)
router.get("/getUser/:id",userMiddleware,getUserById)
router.get("/allUsers",getAllUsers)


export default router