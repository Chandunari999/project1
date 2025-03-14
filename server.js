const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chatapp'
});

db.connect(err => {
    if (err) throw err;
    console.log("Database Connected!");
});

// WebSocket Connection
wss.on('connection', ws => {
    console.log('New Client Connected');
    
    ws.on('message', message => {
        console.log(`Received: ${message}`);
        
        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });

        // Save message to database
        const query = "INSERT INTO messages (message) VALUES (?)";
        db.query(query, [message], (err, result) => {
            if (err) throw err;
            console.log("Message saved to DB");
        });
    });

    ws.on('close', () => console.log('Client Disconnected'));
});

server.listen(3000, () => console.log('Server started on port 3000'));
