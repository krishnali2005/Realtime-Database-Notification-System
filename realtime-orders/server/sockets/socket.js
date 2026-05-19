let io;

function initializeSocket(server) {

    const socketIo = require("socket.io");

    io = socketIo(server, {
        cors: {
            origin: "*"
        }
    });

    io.on("connection", (socket) => {

        console.log("Client connected");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });

    });

    return io;
}

function getIO() {
    return io;
}

module.exports = {
    initializeSocket,
    getIO
};