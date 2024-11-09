import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import transporter from "../config/nodemailer.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = asyncHandler(async (req, res) => {
    const { to, subject } = req.body;

    // Read the HTML template file
    const emailTemplatePath = path.join(__dirname, '../templates/emailTemplate.html');
    console.log("emailTemplatePath:", emailTemplatePath);

    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

 const emailHTML   = emailTemplate
        .replace('[Recipient\'s Name]', "Mohd Uvesh")
        .replace('[Link]', data.topic)
 
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL, // Sender address
        to,                                 // Receiver's email
        subject,                            // Subject line
        html: emailHTML                     // HTML body
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent info:", info);
        return res.status(200).json(
            new ApiResponse(200, { info }, "Email Sent")
        );
    } catch (error) {
        console.error('Error sending email:', error);
        throw new ApiError(500, "Error sending email");
    }
});

const sendEmail1=async ({to,subject,token})=>{
    const emailTemplatePath = path.join(__dirname, '../templates/emailTemplate.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
    const link=`http://localhost:5173/editor1/access/${token}`
    const emailHTML   = emailTemplate
    .replace('[Recipient\'s Name]', "Mohd Uvesh")
    .replace('[link]', link)
    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL, // Sender address
        to,                                 // Receiver's email
        subject,                            // Subject line
        html: emailHTML                     // HTML body
    };
    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent info:", info);
        return true
    } catch (error) {
        return false

    }
}

export { sendEmail,sendEmail1 };
 