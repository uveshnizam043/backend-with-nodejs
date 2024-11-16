    import pkg from 'bullmq';

    // import Redis from 'ioredis';

    import Redis from "../config/redis-connection.js"
    // const redis = new Redis();
    const { Queue, QueueScheduler } = pkg;

    const emailQueue = new Queue('emailQueue', {
    connection: Redis,
    });
    const documentInvitationQueue = new Queue('documentInvitationQueue', {
        connection: Redis,
    });
    

    export { emailQueue,documentInvitationQueue };
