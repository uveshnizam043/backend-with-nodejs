// import { Server } from 'socket.io';
import { app } from "../app.js";
import http from "http";
import * as Y from 'yjs';
// const { Server } = require('@hocuspocus/server');
import {Server} from "@hocuspocus/server"
const hocuspocusServer = Server.configure({
  port: 1234, // Specify the port
});

hocuspocusServer.listen();

const allowedOrigins = 'http://localhost:5173';
const docs = new Map();  // Store document instances
const server = http.createServer(app);
// const io = new Server(server, {
//     cors: {
//         origin: allowedOrigins,  // Allow frontend origin
//         methods: ['GET', 'POST'], // Specify allowed methods
//         credentials: true,       // Allow credentials
//     },
// });
// io.on('connection', (socket) => {
//     console.log(`Client connected: ${socket.id}`);

//     socket.on('join-document', (roomId) => {
//         console.log(`Joining room: ${roomId}`);
//         let doc;

//         // Create a new Yjs document if it doesn't exist
//         if (!docs.has(roomId)) {
//             doc = new Y.Doc();
//             docs.set(roomId, doc);

//             // Broadcast document updates to other clients in the room
//             doc.on('update', (update) => {
//                 socket.to(roomId).emit('doc-update', update);
//             });
//         } else {
//             doc = docs.get(roomId);
//         }

//         // Join the room and send the initial document state to the client
//         socket.join(roomId);
//         socket.emit('doc-init', Y.encodeStateAsUpdate(doc));

//         // Apply updates received from client
//         socket.on('doc-update', (update) => {
//             try {
//                 Y.applyUpdate(doc, update);
//             } catch (error) {
//                 console.error('Error applying update:', error);
//             }
//         });

//         // Handle disconnects
//         socket.on('disconnect', () => {
//             console.log(`Client disconnected: ${socket.id}`);
//             socket.leave(roomId);
//         });
//     });
// });


export { server };
