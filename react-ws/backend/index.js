const { info } = require('console');
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const app = express();
const http = require('http').Server(app);
const routes = require('./routes/routes');
const io = require('socket.io')(http, {cors: {
  origin: "*",
}});
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api',routes);

//app.use(express.json())

const port = process.env.PORT || 4000;

dotenv.config();
const mongoDBString = process.env.DATABASE_URL;
mongoose.connect(mongoDBString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})


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
    socket.to("lobby").emit("user-left", {username: socket.data.username})
  })
  
})

http.listen(port, () => console.log('listening on port ' + port));
