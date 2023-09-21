const socketClient = io();

const userName = document.getElementById("userName");
const inputMsg = document.getElementById("inputMsg");
const sendMsg = document.getElementById("sendMsg");
const chatPanel = document.getElementById("chatPanel");

let user;
Swal.fire({
  title: "chat",
  text: "user name:",
  input: "text",
  inputValidator: (value) => {
    return !value && "please enter your user name";
  },
  allowOutsideClick: false,
  allowEscapeKey: false,
}).then((inputValue) => {
  user = inputValue.value;
  userName.innerHTML = user;
  socketClient.emit("authenticated", user);
});

sendMsg.addEventListener("click", () => {
  const msg = { user, message: inputMsg.value };
  socketClient.emit("msgChat", msg);
  inputMsg.value = "";
});

socketClient.on("chatHistory", (dataServer) => {
  let msgElements = "";
  dataServer.forEach((elm) => {
    msgElements += `<p>user: ${elm.user} >>> ${elm.message}</p>`;
  });
  chatPanel.innerHTML = msgElements;
});

socketClient.on("newUser", (data) => {
  if (user) {
    Swal.fire({ text: data, toast: true, position: "top-right" });
  }
});
