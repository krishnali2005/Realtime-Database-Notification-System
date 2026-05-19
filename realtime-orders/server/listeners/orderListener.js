const pgClient = require("../config/db");
const { getIO } = require("../sockets/socket");

async function startOrderListener() {

    await pgClient.connect();

    console.log("Connected to PostgreSQL");

    await pgClient.query("LISTEN orders_channel");

    console.log("Listening for database changes...");

    pgClient.on("notification", (msg) => {

        console.log("Database notification received");

        const payload = JSON.parse(msg.payload);

        console.log(payload);

        const io = getIO();

        io.emit("orderUpdated", payload);

    });

}

module.exports = startOrderListener;