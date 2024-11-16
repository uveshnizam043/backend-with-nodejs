import nodemailer from "nodemailer"
const transporter = nodemailer.createTransport({
  service: 'gmail', // or your email provider
  port: 465,
  debug:true,
  logger:true,
  secureConnection:false,
  secure:true,
  auth: {
    user: process.env.NODEMAILER_EMAIL, // Your email (add it in .env)
    pass: process.env.NODEMAILER_PASS  // Your password (add it in .env)
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});


export default transporter;
