const socket = io("http://localhost:3000");

const updates = document.getElementById("updates");

socket.on("connect", () => {
    console.log("Connected to server");
});

socket.on("orderUpdated", (data) => {

    console.log("Realtime update:", data);

    const li = document.createElement("li");

    li.innerText =
        `Operation: ${data.operation}
         | Order ID: ${data.data.id}
         | Status: ${data.data.status}`;

    updates.prepend(li);

});