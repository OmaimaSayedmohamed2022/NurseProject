// import bcrypt from 'bcryptjs';
// import User from '../models/clientModel.js';
// import { sendOTP, verifyOTP } from  "../services/otpMessage.js"
// // Send OTP for reset password
// export const sendOTPForResetPassword = async (req, res) => {
//     const { phone } = req.body;
  
//     try {
//       const otp = await sendOTP(phone);
//       res.status(200).json({ message: 'OTP sent successfully', otp });
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to send OTP' });
//     }
//   };
  
//   // Reset password
//   export const resetPassword = async (req, res) => {
//     const { phoneNumber, otp, newPassword } = req.body;
  
//     try {
//       // Verify OTP
//       const isOTPValid = await verifyOTP(phoneNumber, otp);
//       if (!isOTPValid) {
//         return res.status(400).json({ error: 'Invalid OTP' });
//       }
  
//       // Find the user by phone number
//       const user = await User.findOne({ phoneNumber });
//       if (!user) {
//         return res.status(404).json({ error: 'User not found' });
//       }
  
//       // Hash the new password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash(newPassword, salt);
  
//       // Update the user's password
//       user.password = hashedPassword;
//       await user.save();
  
//       res.status(200).json({ message: 'Password reset successfully' });
//     } catch (error) {
//       console.error('Error resetting password:', error);
//       res.status(500).json({ error: 'Failed to reset password' });
//     }
  // };