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

  socket.on('leave-lobby', (data) => {
    socket.to(data.lobby).emit('user-left', {username: data.username})
    socket.leave(data.lobby)
  })

  socket.on('get-all-lobbies', async () => {
    const sockets = await io.fetchSockets();
    const socketIDs = [...sockets].map(e => e.id)
    socket.emit("lobby-info", {list: [...rooms.keys()].filter(e => !socketIDs.includes(e))})
  })

  socket.on("disconnect", () => {
    for (const room in [...[...socket.rooms].filter(e => e !== socket.id)]) {
      socket.to(room).emit("user-left", {username: socket.data.username})
    }
  })

  socket.on("start-game", (data) => {
    socket.to(data.lobby).emit("game-started", {players: data.players})
  })

  socket.on("post-coords", (data) => {
    const filteredData = {...data}
    delete filteredData["lobby"]
    socket.to(data.lobby).emit("coords-update", filteredData)
  })

  
})

http.listen(port, () => console.log('listening on port ' + port));
