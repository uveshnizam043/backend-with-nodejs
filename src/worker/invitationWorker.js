import redisConnection from '../config/redis-connection.js';
import { sendEmail1 } from '../controllers/emailController.js'

async function processDocumentInvitation() {
  while (true) {
    try {
      // Get the next job from the queue
      const jobData = await redisConnection.rPop('documentInvitationQueue');
      if (jobData) {
        const { to, title,message,subject, token } = JSON.parse(jobData);
        console.log("JSON.parse(jobData);",JSON.parse(jobData));
          const statusEmail =await  sendEmail1({ to, message,title,subject:"Document just shared", token,emailType:'documentInvitation' })
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

processDocumentInvitation();
