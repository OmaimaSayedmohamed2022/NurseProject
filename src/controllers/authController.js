import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Nurse from "../models/nurseModel.js";
import Client from "../models/clientModel.js"; 
import logger from "../utilites/logger.js";



// Login 
export const loginUser = async (req, res) => {
    const { email, password ,role} = req.body;
  
    try {
      // Check if the user exist
      let user = await Client.findOne({ email });
      let userType = 'Client';
      
      if (!user) {
        user = await Nurse.findOne({ email });
        userType = 'Nurse';
      }
  
      if (!user) {
        logger.warn("User Not Found Try Again !");
        return res.status(404).json({ message: 'User not found.' });
      }
  
    const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        logger.warn(`Invalid password attempt for email: ${email}`);
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Generate JWT token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role || userType,
        },
        process.env.JWT_SECRE,
        { expiresIn: '1h' }
      );
  
      logger.info(`User logged in successfully as ${userType}: ${email}`);
  
      // Send response
      res.status(200).json({
        token,
        user: {
          id: user._id,
          email: user.email,
          role: user.role || userType,
        },
      });
    } catch (error) {
      logger.error('Error in loginUser:', error);
      res.status(500).json({ message: 'Server error.' });
    }
  };
  
  
  const blacklist = new Set();
  
  export const logOutUser = (req, res) => {
      try {
          const token = req.headers.authorization?.split(' ')[1];
          if (!token) {
              return res.status(400).json({ message: 'Bad request. Token is missing.' });
          }
  
          blacklist.add(token);
  
          res.status(200).json({ status: true, message: 'Logged out successfully.' });
      } catch (error) {
          console.error('Error in logOutUser:', error);
          res.status(500).json({ message: 'Internal server error' });
      }
  };