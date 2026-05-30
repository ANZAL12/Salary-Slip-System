import nodemailer from 'nodemailer';

// Configure the SMTP Transporter
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
  },
});

// Verify connection configuration
export const verifyConnection = async () => {
  try {
    const success = await transporter.verify();
    if (success) {
      console.log('Server is ready to take our messages');
    }
    return success;
  } catch (error) {
    console.error('SMTP Connection Error:', error);
    return false;
  }
};
