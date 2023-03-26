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
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"]
});

function App() {
  const [lobbies, setLobbies] = useState([])
  const [lobbyUsers, setLobbyUsers] = useState([])
  const [username, setUsername] = useState("")
  const [page, setPage] = useState("login")
  const [currentLobby, setCurrentLobby] = useState("")
  const [otherPlayers, setOtherPlayers] = useState([])
  const [winner, setWinner] = useState("")


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

    function handleGameStarted(data) {
      setOtherPlayers([...data.players.map(e => ({username: e, laps: 0}))])
      setPage("game")
    }

    function handleCoordsUpdate(data) {
      setOtherPlayers(prev => {
        const index = prev.findIndex(e => e.username === data.username)
        if (index > -1) {
          let newArr = [...prev]
          newArr[index] = {...newArr[index], ...data}
          return newArr
        }
        return prev
      })
    }

    function handleCompletedLap(data) {
      setOtherPlayers(prev => {
        const index = prev.findIndex(e => e.username === data.username)
        if (index > -1) {
          let newArr = [...prev]
          newArr[index] = {...newArr[index], laps: data.laps}
          return newArr
        }
        return prev
      })
    }

    function handleGameOver(data) {
      setWinner(data.winner)
      setPage("postgame")
      setLobbyUsers([])
      setOtherPlayers([])
      setCurrentLobby("")
      setLobbies([])
    }

    socket.on("joined-lobby", handleOtherUser)
    socket.on("existing-users", handleExistingUsers)
    socket.on("user-left", handleUserLeft)
    socket.on("lobby-info", handleLobbyList)
    socket.on("game-started", handleGameStarted)
    socket.on("coords-update", handleCoordsUpdate)
    socket.on("lap-completed", handleCompletedLap)
    socket.on("game-over", handleGameOver)

    return () => {
      socket.disconnect()
      socket.off("joined-lobby", handleOtherUser)
      socket.off("existing-users", handleExistingUsers)
      socket.off("user-left", handleUserLeft)
      socket.off("lobby-info", handleLobbyList)
      socket.off("game-started", handleGameStarted)
      socket.off("coords-update", handleCoordsUpdate)
      socket.off("lap-completed", handleCompletedLap)
      socket.off("game-over", handleGameOver)
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
    socket.emit("start-game", {lobby: currentLobby, players: [...lobbyUsers]})
    setOtherPlayers([...lobbyUsers.map(e => ({username: e, laps: 0}))])
    setPage("game")
  }

  function sendCoords(x, y, orientation, velocity) {
    socket.emit("post-coords", {lobby: currentLobby, username, x, y, orientation, velocity})
  }

  function broadcastLap(laps) {
    console.log(laps)
    socket.emit("complete-lap", {lobby: currentLobby, laps})
  }

  return (
    <div className="App">
      {page === "login" ? <Login setUsername={setUsername} fetchLobbies={fetchLobbies} setPage={setPage}/>
       : page === "lobbyselector" ? <LobbySelector fetchLobbies={fetchLobbies} joinLobby={joinLobby} lobbies={lobbies} setLobbies={setLobbies} setPage={setPage}/>
       :  page === "lobby" ? <Lobby lobbyUsers={lobbyUsers} setPage={setPage} leaveLobby={leaveLobby} startGame={startGame}/>
       : page === "game" ? <Game sendCoords={sendCoords} otherPlayers={[...otherPlayers.filter(e => e.username !== username)]} broadcastLap={broadcastLap}/>
       : page === "postgame" ? <PostGame winner={winner} setPage={setPage}/>
       : <div/>
      }
    </div>
  );
}

export default App;
