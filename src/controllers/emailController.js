// app.js or server.js
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import transporter from "../config/nodemailer.js"
import path from "path"

const sendEmail = asyncHandler(async (req, res) => {
    const { to, subject } = req.body;
    // console.log("__dirname",__dirname)

    // // Read the HTML template file
    // const emailTemplatePath = path.join(__dirname, 'emailTemplate.html');
    // const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf8');
    // const emailHTML = emailTemplate.replace('[Recipient\'s Name]', 'John Doe');


    const mailOptions = {
        from: process.env.NODEMAILER_EMAIL,// Sender address
        to,                      // Receiver's email
        subject,                 // Subject line
        // html: emailHTML
    };

    try {
        // Send the email
        const info = await transporter.sendMail(mailOptions);
        return res.status(200).json(
            new ApiResponse(200, { info: info }, "Email Sent")
        )
    } catch (error) {
        console.error('Error sending email:', error);
        // res.status(500).json({ message: 'Error sending email', error });
        throw new ApiError(500, "Error sending email");
    }
})
export {sendEmail} 