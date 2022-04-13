import http from "http";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res)=> res.render("home"));
app.get("/*", (_, res)=> res.redirect("/"));

const httpServer = http.createServer(app);
const ioServer = SocketIO(httpServer);

function PublicRooms() {
	const { sids, rooms } = ioServer.sockets.adapter;
	const publicRoomsList = [];
	rooms.forEach((_, key) => {
		if (sids.get(key) === undefined) {
			publicRoomsList.push(key);
		}
	});
	return publicRoomsList;
}

ioServer.on("connection", (socket) => {
	socket["nickname"] = "Anonymous"
    socket.onAny((event) => {
		socket.onAny((event) => {
			// console.log(ioServer.sockets.adapter);
			console.log(`Socket Event: ${event}`);
		});
	});
	socket.on("room_enter", (roomName, done) => {
		socket.join(roomName);
		done();
		socket.to(roomName).emit("welcome", socket.nickname);
		ioServer.sockets.emit("room_change", PublicRooms());
    });
    socket.on("disconnecting", () => {
        socket.rooms.forEach(room => 
			socket.to(room).emit("bye", socket.nickname)
		);
    });
	socket.on("disconnect", () => {
		ioServer.sockets.emit("room_change", PublicRooms());
	})
    socket.on("new_message", (msg, room, done) => {
        socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
        done();
    });
	socket.on("nickname", nickname => socket["nickname"] = nickname)
});

/*
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
}); */

// httpServer.listen(3000, () => console.log(`Listening on: http://localhost:3000/`));
httpServer.listen(3000, () => console.log(`Listening on: https://zoom-clone--susze.run.goorm.io/`));