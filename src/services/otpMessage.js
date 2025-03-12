import twilio from 'twilio';
import redis from 'redis';

// Twilio credentials
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Redis client
const redisClient = redis.createClient();

// Initialize Twilio client
const client = twilio(accountSid, authToken);

// Function to generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via SMS
export const sendOTP = async (phoneNumber) => {
  const otp = generateOTP();

  try {
    // Send SMS using Twilio
    const message = await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    console.log(`OTP sent to ${phoneNumber}: ${otp}`);

    // Store the OTP in Redis with a 5-minute expiry
    redisClient.setex(phoneNumber, 300, otp); // 300 seconds = 5 minutes

    return otp; // Return the OTP for verification
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Function to verify OTP
export const verifyOTP = async (phoneNumber, userOTP) => {
  try {
    // Get the stored OTP from Redis
    redisClient.get(phoneNumber, (err, storedOTP) => {
      if (err) {
        console.error('Error retrieving OTP from Redis:', err);
        throw new Error('Failed to verify OTP');
      }

      if (storedOTP === userOTP) {
        console.log('OTP verified successfully');
        return true;
      } else {
        console.log('Invalid OTP');
        return false;
      }
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
}