import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = process.env.TWILIO_VERIFY_SID;

const client = twilio(accountSid, authToken);

// Send OTP using Twilio Verify
export const sendOTP = async (phoneNumber) => {
  try {
    const verification = await client.verify.v2
      .services(verifySid)
      .verifications.create({
        to: phoneNumber,
        channel: 'sms',
      });

    console.log('OTP sent:', verification.status);
    return verification.status;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw new Error('Failed to send OTP');
  }
};

// Verify OTP using Twilio Verify
export const verifyOTP = async (phoneNumber, code) => {
  try {
    const verification_check = await client.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: phoneNumber,
        code,
      });

    console.log('Verification result:', verification_check.status);
    return verification_check.status === 'approved';
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw new Error('Failed to verify OTP');
  }
};
