import jwt from 'jsonwebtoken';
import Nurse from '../models/nurseModel.js';
import Client from '../models/clientModel.js';
import Admin from '../models/adminModel.js'
import { generateFullPermissions } from '../utilites/permissionHelper.js';

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ Decoded token:", decoded); // 👈 log the full payload
    
    const currentTime = Math.floor(Date.now() / 1000); // وقت UNIX الحالي بالثواني
    console.log(currentTime);
    
    let user =
      await Nurse.findById(decoded.id) ||
      await Client.findById(decoded.id) ||
      await Admin.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const role = user.role || "client";
    console.log("👤 User role:", role); // 👈 log the role being used

    req.user = {
      id: user._id,
      role,
      permissions:
        (["Admin"].includes(role)) 
          ? generateFullPermissions() 
          : user.permissions || {}
    };

    next();
  } catch (error) {
    console.error("❌ Token verification failed:", error); // log token error
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
