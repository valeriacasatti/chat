import express from "express";
import { __dirname } from "./utils.js";
import path from "path";
import { engine } from "express-handlebars";
import { viewsRouter } from "./routes/views.routes.js";
import { Server } from "socket.io";

const port = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));

const httpServer = app.listen(port, () =>
  console.log(`server running in port ${port}`)
);

const io = new Server(httpServer);

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views"));

app.use(viewsRouter);

let chat = [];

io.on("connection", (socket) => {
  //historial del chat
  socket.emit("chatHistory", chat);
  //msg de cada user
  socket.on("msgChat", (data) => {
    chat.push(data);
    io.emit("chatHistory", chat);
  });

  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUser", `user ${data} connected`);
  });
});
