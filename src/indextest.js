import connectDB from "./db/index.js";
import dotenv from "dotenv";
import http from "http"
import { app } from "./app.js";
import { Server } from 'socket.io';
import {createClient } from "redis"
import { Document  } from "./models/document.model.js";
// import { y-websocket } from 'y-websocket'
import * as Y from 'yjs';
// Set up Redis clients (one for publishing, one for subscribing)
const redisClient = createClient();
const redisSubscriber = createClient();
// Connect to Redis
redisClient.connect();
redisSubscriber.connect();
// Subscribe to the Redis channel for document changes
redisSubscriber.subscribe('document-updates', (message) => {
  const data = JSON.parse(message);
  // Broadcast the changes to all connected clients
  io.to(data.docId).emit('document-change', data);
});


const allowedOrigins = 'http://localhost:5173';

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,   // Allow frontend origin
    methods: ['GET', 'POST'], // Specify allowed methods
    credentials: true,        // Allow credentials
  },
});
io.on('connection', (socket) => {
  const ydoc = new Y.Doc();


  // Join a room based on document ID
  socket.on('join-document', (docId) => {
    socket.join(docId);
    // console.log(`Client joined document room: ${docId}`);

    // You can send the initial document state from Redis (if stored) to the client here
    redisClient.get(`document:${docId}`).then((documentState) => {
      console.log("documentState",documentState)
      socket.emit('document-load', documentState); // Send the document state to the client
    });
  });

  // Handle document change events from the client
  socket.on('document-change', (data) => {
    const { docId, changes } = data;
    // console.log("document-change",data)
    // Store the changes in Redis (optional)
    redisClient.set(`document:${docId}`, JSON.stringify(changes));

    // Publish the changes to Redis
    redisClient.publish('document-updates', JSON.stringify({ docId, changes }));
  });

  socket.on('client-disconnect', (data) => {
    console.log('Client disconnected',data);
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
  

});


dotenv.config({ path: "./env" });
connectDB().then(() => {
  server.listen(process.env.PORT || 8000, () => {
    console.log(`Server is running at port",${process.env.PORT}`);
  })
}).catch((err) => {
  console.log("MONGO db connection failed !!! ", err);
})







































// directly connecting db here not
// ;(async()=>{

//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`)
//         app.on("error",()=>{
//             console.log("Error in express js");
//             throw error

//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`);
//         })
//     } catch (error) {
//     console.log("error while connect error",error);
//     }
// })()
