import redisConnection from '../config/redis-connection.js';
import { sendVerificationEmail } from '../controllers/emailController.js'

async function processEmailQueue() {
  while (true) {
    try {
      const jobData = await redisConnection.rPop('userVerifyEmail');
      if (jobData) {
        const { email, username, verificationToken } = JSON.parse(jobData);
          const statusEmail =await  sendVerificationEmail({ to:email,subject:"Please verify you email",  username:username,token:verificationToken })
          console.log("status of job is ",statusEmail)
      } else {
        // If queue is empty, wait for some time before checking again
        console.log('No email jobs in queue, waiting...');
        await new Promise((resolve) => setTimeout(resolve, 1000));  // Wait 1 second
      }
    } catch (err) {
      console.error('Error processing email job:', err);
    }
  }
}

// Start the email worker
processEmailQueue();
