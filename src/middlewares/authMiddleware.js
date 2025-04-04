import jwt from 'jsonwebtoken';
import Nurse from '../models/nurseModel.js';
import Client from '../models/clientModel.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    let user = await Nurse.findById(req.user.id);
    if (!user){
        user = await Client.findById(req.user.id);
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    req.user.role = user.role; 
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

// generate token
export const generateToken = (user, userType) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role || userType,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
