import express, { Request, Response } from 'express';
import http from 'http';
import WebSocket, { WebSocketServer } from 'ws';
import env from 'dotenv'

const app = express();
env.config();
const port = process.env.PORT || 5000;

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// WebSocket connection event
wss.on('connection', (socket: WebSocket) => {
    console.log('Client connected');
    socket.send("Hello! Connected to Server");

    // Listen for messages from the client
    socket.on('message', (message: string) => {
        console.log(`Received: ${message}`);

        // Respond to the client
        socket.send(`${message}`);
    });

    // When the client disconnects
    socket.on('close', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript backend!');
});

// Start the server
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
