import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import transporter from "../config/nodemailer.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from 'url';
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email provider
    port: 465,
    debug: true,
    logger: true,
    secureConnection: false,
    secure: true,
    auth: {
        user: 'mohduvesh043@gmail.com', // Your email (add it in .env)
        pass: 'ouilacwbuqldeqiz'  // Your password (add it in .env)
    },
    tls: {
        // do not fail on invalid certs
        rejectUnauthorized: false,
    },
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sendEmail = asyncHandler(async (req, res) => {
    const { to, subject } = req.body;
    console.log("sendEmail1", to, subject);
    console.log("env", process.env.NODEMAILER_PASS);
    console.log("env", process.env.NODEMAILER_EMAIL);
    // Read the HTML template file
    const emailTemplatePath = path.join(__dirname, '../templates/emailTemplate.html');
    console.log("emailTemplatePath:", emailTemplatePath);

    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');

    const emailHTML = emailTemplate
        .replace('[Recipient\'s Name]', "Mohd Uvesh")
        .replace('[Link]', data.topic)

    const mailOptions = {
        from: 'mohduvesh043@gmail.com', // Sender address
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

const createDocumentShareTemplate = (title,message, token) => {
    const emailTemplatePath = path.join(__dirname, '../templates/emailTemplate.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
    const link = `http://localhost:5173/editor/access/${token}`
    const newtitle = `Document Shared `
    const emailHTML = emailTemplate
        .replace('[message]', message)
        .replace('[shareUsername]', newtitle)
        .replace('[link]', link)
    return emailHTML
}
const createVerifyTemplate = (username, token) => {
    const emailTemplatePath = path.join(__dirname, '../templates/emailVerification.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
    const link = `http://localhost:5173/verify/${token}`
    const title = `${username} Kindly verify your email to complete your account registration.`
    const emailHTML = emailTemplate
        .replace('[title]', title)
        .replace('[link]', link)
    return emailHTML
}


const sendVerificationEmail = async ({ to, subject, username, token }) => {
    const emailHTML = createVerifyTemplate(username, token)
    console.log("emailHTML", emailHTML);
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

// to, title,subject, token,emailType:'documentInvitation'
const sendEmail1 = async ({ to,message, title,subject, token, template, emailType = 'userVerify' }) => {
    let emailHTML;
    if (emailType == 'userVerify') {
        emailHTML = createVerifyTemplate()

    } else if (emailType == 'documentInvitation') {
        emailHTML = createDocumentShareTemplate(title,message,token)

    }
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

export { sendEmail, sendEmail1, sendVerificationEmail };
