import logo from './logo.svg';
import {useEffect, useState} from "react"
import './App.css';
import { io } from "socket.io-client"

import Lobby from './pages/Lobby';
import Login from './pages/Login';
import LobbySelector from './pages/LobbySelector';
import Game from './pages/Game'
import PostGame from './pages/PostGame';

const URL = 'http://localhost:4000';
const socket = io(URL, {
  autoConnect: false
});

function App() {
  const [lobbies, setLobbies] = useState([])
  const [lobbyUsers, setLobbyUsers] = useState([])
  const [username, setUsername] = useState("")
  const [page, setPage] = useState("login")
  const [currentLobby, setCurrentLobby] = useState("")


  useEffect(() => {
    socket.connect();

    function handleOtherUser(data) {
      setLobbyUsers(prev => [...prev, data.username])
    }

    function handleExistingUsers(data) {
      setLobbyUsers(prev => [...data.list])
    }

    function handleUserLeft(data) {
      setLobbyUsers(prev => [...prev.filter(e => e !== data.username)])
    }

    function handleLobbyList(data) {
      setLobbies(data.list)
    }

    function handleGameStarted() {
      setPage("game")
    }

    socket.on("joined-lobby", handleOtherUser)
    socket.on("existing-users", handleExistingUsers)
    socket.on("user-left", handleUserLeft)
    socket.on("lobby-info", handleLobbyList)
    socket.on("game-started", handleGameStarted)


    return () => {
      socket.disconnect()
      socket.off("joined-lobby", handleOtherUser)
      socket.off("existing-users", handleExistingUsers)
      socket.off("user-left", handleUserLeft)
      socket.off("lobby-info", handleLobbyList)
      socket.off("game-started", handleGameStarted)
    }
  }, [])

  function fetchLobbies() {
    socket.emit("get-all-lobbies")
  }

  function joinLobby(lobby) {
    socket.emit("join-lobby", {lobby: lobby, username: username})
    setCurrentLobby(lobby)
  }

  function leaveLobby() {
    socket.emit("leave-lobby", {lobby: currentLobby, username: username})
    setPage("lobbyselector")
  }

  function startGame() {
    socket.emit("start-game", {lobby: currentLobby})
    setPage("game")
  }

  function sendCoords(x, y, orientation, velocity) {
    socket.emit("post-coords", {username: username, x, y, orientation, velocity})
  }

  return (
    <div className="App">
      {page === "login" ? <Login setUsername={setUsername} fetchLobbies={fetchLobbies} setPage={setPage}/>
       : page === "lobbyselector" ? <LobbySelector fetchLobbies={fetchLobbies} joinLobby={joinLobby} lobbies={lobbies} setLobbies={setLobbies} setPage={setPage}/>
       :  page === "lobby" ? <Lobby lobbyUsers={lobbyUsers} setPage={setPage} leaveLobby={leaveLobby} startGame={startGame}/>
       : page === "game" ? <Game sendCoords={sendCoords}/>
       : page === "postgame" ? <PostGame/>
       : <div/>
      }
    </div>
  );
}

export default App;
