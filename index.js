const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const path = require("path");
var userip = ""
function getIP(json) {
  console.log("My public IP address is: ", json.ip);
}

const app = express();
const httpserver = http.Server(app);
const io = socketio(httpserver);
var ip = ""
const gamedirectory = path.join(__dirname, "html");

app.use(express.static(gamedirectory));

httpserver.listen(3000);

var rooms = [];
var usernames = [];

io.on('connection', function(socket){

  socket.on("join", function(room, username, userip){
    function getIP(json) {
          ip = json.ip;
      }
    if (username != ""){
      rooms[socket.id] = room;
      usernames[socket.id] = username;
      socket.leaveAll();
      socket.join(room);
      io.in(room).emit("recieve", "Server : " + username + " has entered the chat.");
      socket.emit("join", room);
      console.log(username + ", " + room + ", " + userip)
    }
  })

  socket.on("send", function(message){
    io.in(rooms[socket.id]).emit("recieve", usernames[socket.id] +" : " + message);
    //console.log(username)
  })

  socket.on("recieve", function(message){
    socket.emit("recieve", message);
  })
})
o