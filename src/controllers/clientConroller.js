import Client from "../models/clientModel.js";
import bcrypt from "bcryptjs";
import logger from "../utilites/logger.js";
import { generateToken } from "../middlewares/authMiddleware.js";
import uploadToCloudinary from "../middlewares/uploadToCloudinary.js";
import { calculateProfileCompletion } from "../utilites/calculateProfileCompletion.js";



export const createUser= async(req,res)=>{
  const {userName,email,password,role,phone,age,years,gender}= req.body;
  try{
   const salt= await bcrypt.genSalt(10)
   const hashedPssword= await bcrypt.hash(password,salt)

   const newUser= new Client({
       userName,
       email,
       password:hashedPssword,
       role,
       phone,
       age,
       years,
       gender,
   });
     const token = generateToken({ _id: newUser._id, email, role });
    await newUser.save()
    res.status(201).json({message:"new user created successfuly",newUser,token})
  }catch(error){
   res.status(500).json({message:"error creatting new user",error:error.message})
  logger.error({message:"error creatting new user",error:error.message})
  }

}
// update client profile
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const updatedData= {...req.body}
  // console.log("Received data:", updatedData);
  try {
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      updatedData.image = imageUrl;
    }

      const updatedUser = await Client.findByIdAndUpdate(id, updatedData, {
          new: true, 
          runValidators: true, 
         
      });
      if (!updatedUser) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
      console.error('Error updating user:', error.message || error);
      res.status(500).json({ message: error.message || 'Internal server error.' });
  }
};




export const deleteUser= async(req,res)=>{
    const {id}= req.params;
    try{
        const deletedUser = await Client.findByIdAndDelete(id)
        res.status(201).json({message:"user deleted successfuly",  deletedUser})   
    } catch(error){
        logger.error('Error deleting user:', error.message || error);
        res.status(500).json({ message: error.message || 'Internal server error.' });
      }
}

export const getUserById= async(req,res)=>{
    // console.log('req.params:', req.params);
   const {id} = req.params
try{
    const user = await Client.findById(id)
    res.status(201).json({message:"user fetched successfuly",  user})   
} catch(error){
    logger.error('Error fetching user:', error.message || error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
}

export const getAllUsers = async(req ,res)=>{
  try{
   const users = await Client.find().select("-password")
   res.status(201).json({message:"users fetched successfuly",  users})   
  } catch(error){
    logger.error('Error fetching users:', error.message || error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
}



// completion precent

export const getProfileCompletion = async (req, res) => {
  const { id } = req.params;

  try {
    const completionPercentage = await calculateProfileCompletion(id);

    res.status(200).json({
      message: "Profile completion retrieved successfully",
      profileCompletion: `${completionPercentage}%`
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};


export const completeUserProfile = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    if (req.files && req.files.length > 0) {
      const uploadedFiles = await Promise.all(
        req.files.map(file => uploadToCloudinary(file))
      );
      updatedData.medicalFiles = uploadedFiles.map(url => ({ fileUrl: url }));
    }
    const user = await Client.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User profile updated successfully",
      user
  
    });
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};


