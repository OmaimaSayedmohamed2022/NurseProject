import bcrypt from 'bcryptjs';
import Admin from '../models/adminModel.js';
import Client from '../models/clientModel.js';
import Nurse from '../models/nurseModel.js';
import { sendOTP, verifyOTP } from "../services/otpMessage.js";

// إرسال OTP
export const sendOTPForResetPassword = async (req, res) => {
  const { phone } = req.body;

  try {
    // Check if the phone number exists in any user model (Admin, Client, Nurse)
    let user = await Admin.findOne({ phone });
    if (!user) {
      user = await Client.findOne({ phone });
    }
    if (!user) {
      user = await Nurse.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send OTP to the phone number
    const otp = await sendOTP(phone);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// إعادة تعيين كلمة المرور
export const resetPassword = async (req, res) => {
  const { phone, otp, newPassword } = req.body;

  try {
    const isOTPValid = await verifyOTP(phone, otp);
    if (!isOTPValid) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    // Check if the phone number exists in any user model (Admin, Client, Nurse)
    let user = await Admin.findOne({ phone});
    if (!user) {
      user = await Client.findOne({ phone });
    }
    if (!user) {
      user = await Nurse.findOne({ phone });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
