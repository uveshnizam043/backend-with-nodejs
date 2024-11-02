import { Server } from 'socket.io';
import http from 'http';
import * as Y from 'yjs';

// Constants
const allowedOrigins = 'http://localhost:5173';
const docs = new Map(); // In-memory storage for documents

// Create an HTTP server
const server = http.createServer();
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on('join-document', (roomId) => {
        console.log(`Joining room: ${roomId}`);
        let doc;

        // Create a new Yjs document if it doesn't exist
        if (!docs.has(roomId)) {
            doc = new Y.Doc();
            docs.set(roomId, doc);

            // Broadcast document updates to other clients in the room
            doc.on('update', (update) => {
                socket.to(roomId).emit('doc-update', update);
            });
        } else {
            doc = docs.get(roomId);
        }

        // Join the room and send the initial document state to the client
        socket.join(roomId);
        socket.emit('doc-init', Y.encodeStateAsUpdate(doc));

        // Apply updates received from client
        socket.on('doc-update', (update) => {
            try {
                Y.applyUpdate(doc, update);
            } catch (error) {
                console.error('Error applying update:', error);
            }
        });

        // Handle disconnects
        socket.on('disconnect', () => {
            console.log(`Client disconnected: ${socket.id}`);
            socket.leave(roomId);
        });
    });
});

// Start the server
const PORT = 8000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export { server };
