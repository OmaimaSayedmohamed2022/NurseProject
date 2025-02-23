import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import logger from "../utilites/logger.js";


export const createUser= async(req,res)=>{
   const {userName,email,password,role,phone}= req.body;
   try{
    const salt= await bcrypt.genSalt(10)
    const hashedPssword= await bcrypt.hash(password,salt)
    const newUser= new User({
        userName,
        email,
        password:hashedPssword,
        role,
        phone
    });
     await newUser.save()
     res.status(201).json({message:"new user created successfuly",newUser})
   }catch(error){
    res.status(500).json({message:"error creatting new user",error:error.message})
   logger.error({message:"error creatting new user",error:error.message})
   }

}

export const updateUser = async(req,res)=>{
 const {id}= req.params;
 try{
 const  udatedUser = await User.findByIdAndUpdate(id,req.body,{
    new:true,
    runValidators:true
 });
 res.status(201).json({message:"user updated successfuly",  udatedUser})
} catch(error){
    logger.error('Error updating user:', error.message || error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
}


export const deleteUser= async(req,res)=>{
    const {id}= req.params;
    try{
        const deletedUser = await User.findByIdAndDelete(id)
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
    const user = await User.findById(id)
    res.status(201).json({message:"user fetched successfuly",  user})   
} catch(error){
    logger.error('Error fetching user:', error.message || error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
}

export const getAllUsers = async(req ,res)=>{
  try{
   const users = await User.find().select("-password")
   res.status(201).json({message:"users fetched successfuly",  users})   
  } catch(error){
    logger.error('Error fetching users:', error.message || error);
    res.status(500).json({ message: error.message || 'Internal server error.' });
  }
}