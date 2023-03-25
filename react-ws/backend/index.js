
const { info } = require('console');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {cors: {
  origin: "*",
}});
const port = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send(`Status Ok: ${new Date()}`);
});

//app.use(express.static(__dirname + '/public'));

const lobbies = {
  "lobby": []
}

function onConnection(socket) {
  socket.on('join-lobby', (data) => {
    socket.join(data.lobby)
    socket.to(data.lobby).emit('joined-lobby', {username: data.username})
    lobbies[data.lobby].push({name: data.username, id: socket.id})
    socket.emit("existing-users", {list: lobbies[data.lobby].map(e => e.name)})
  });

  socket.on("disconnect", () => {
    const uname = [...lobbies["lobby"].filter(e => e.id === socket.id)][0].name
    console.log(lobbies["lobby"])
    lobbies["lobby"] = [...lobbies["lobby"].filter(e => e.id !== socket.id)]
    console.log(lobbies["lobby"])
    console.log(uname)
    socket.to("lobby").emit("user-left", {username: uname})
  })
  
}

io.on('connection', onConnection);


http.listen(port, () => console.log('listening on port ' + port));
