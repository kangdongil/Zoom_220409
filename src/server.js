import http from "http";
import WebSocket from "ws";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res)=> res.render("home"));
app.get("/*", (_, res)=> res.redirect("/"));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", (socket) => {
    sockets.push(socket);
    socket["nickname"] = "Anonymous";
    console.log("Connected At Browser ✅");
    socket.on("close", () => console.log("Disconnected from Browser ❌"));
    socket.on("message", (aMessage) => {
        const message = JSON.parse(aMessage);
        switch(message.type) {
            case "new_message":
                sockets.forEach(aSocket => aSocket.send(
                    `${socket.nickname.toString()}: ${message.payload.toString()}`));
                break;
            case "nickname":
                socket["nickname"] = message.payload;
                break;
        }
    });
    socket.send("Hi!");
});

server.listen(3000, () => console.log(`Listening on: http://localhost:3000/`));