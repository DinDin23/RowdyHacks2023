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

const rooms = io.of("/").adapter.rooms;
const sids = io.of("/").adapter.sids;

//app.use(express.static(__dirname + '/public'));


io.on('connection', (socket) => {
  socket.on('join-lobby', async (data) => {
    socket.join(data.lobby)
    socket.to(data.lobby).emit('joined-lobby', {username: data.username})
    socket.data.username = data.username
    // tell the socket who all is in the lobby 
    const sockets = await io.in(data.lobby).fetchSockets();
    socket.emit("existing-users", {list: sockets.map(e => e.data.username)})
  });

  socket.on("disconnect", () => {
<<<<<<< HEAD
    const uname = [...lobbies["lobby"].filter(e => e.id === socket.id)][0].name
    lobbies["lobby"] = [...lobbies["lobby"].filter(e => e.id !== socket.id)]
    socket.to("lobby").emit("user-left", {username: uname})
=======
    socket.to("lobby").emit("user-left", {username: socket.data.username})
>>>>>>> 0ebfa5d (Added page files and refactored backend)
  })
  
})

http.listen(port, () => console.log('listening on port ' + port));
