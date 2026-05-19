require("dotenv").config();

console.log("Step 1: dotenv loaded");

const http = require("http");

console.log("Step 2: http loaded");

const app = require("./app");

console.log("Step 3: app loaded");

const socketModule = require("./sockets/socket");

console.log(socketModule);

const initializeSocket = socketModule.initializeSocket;

console.log("Step 4: socket module loaded");

const startOrderListener = require("./listeners/orderListener");

console.log("Step 5: listener loaded");

const server = http.createServer(app);

console.log("Step 6: server created");

initializeSocket(server);

console.log("Step 7: socket initialized");

startOrderListener();

console.log("Step 8: listener started");

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});