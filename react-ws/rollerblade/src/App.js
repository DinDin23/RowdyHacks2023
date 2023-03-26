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


  useEffect(() => {
    socket.connect();

    function handleOtherUser(data) {
      setLobbyUsers(prev => [...prev, data.username])
    }

    function handleExistingUsers(data) {
      setLobbyUsers(prev => [...prev, ...data.list])
    }

    function handleUserLeft(data) {
      setLobbyUsers(prev => [...prev.filter(e => e !== data.username)])
    }

    function handleLobbyList(data) {
      setLobbies(data.list)
    }

    socket.on("joined-lobby", handleOtherUser)
    socket.on("existing-users", handleExistingUsers)
    socket.on("user-left", handleUserLeft)
    socket.on("lobby-info", handleLobbyList)


    return () => {
      socket.disconnect()
      socket.off("joined-lobby", handleOtherUser)
      socket.off("existing-users", handleExistingUsers)
      socket.off("user-left", handleUserLeft)
      socket.off("lobby-info", handleLobbyList)
    }
  }, [])

  function fetchLobbies() {
    socket.emit("get-all-lobbies")
  }

  function joinLobby(lobby) {
    socket.emit("join-lobby", {lobby: lobby, username: username})
  }

  return (
    <div className="App">
      {page === "login" ? <Login setUsername={setUsername} fetchLobbies={fetchLobbies} setPage={setPage}/>
       : page === "lobbyselector" ? <LobbySelector joinLobby={joinLobby} lobbies={lobbies} setLobbies={setLobbies} setPage={setPage}/>
       :  page === "lobby" ? <Lobby lobbyUsers={lobbyUsers} setPage={setPage}/>
       : page === "game" ? <Game/>
       : page === "postgame" ? <PostGame/>
       : <div/>
      }
    </div>
  );
}

export default App;
