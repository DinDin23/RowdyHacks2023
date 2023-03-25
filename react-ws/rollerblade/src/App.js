import logo from './logo.svg';
import {useEffect, useState} from "react"
import './App.css';
import { io } from "socket.io-client"

import Lobby from './pages/Lobby';
import Login from './pages/Login';
import LobbySelector from './pages/LobbySelector';
import Game from './pages/Game'
import PostGame from './pages/PostGame';

import { GoogleLogin } from '@react-oauth/google';

const URL = 'http://localhost:4000';
const socket = io(URL, {
  autoConnect: false
});

function App() {
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
      console.log(data)
      setLobbyUsers(prev => [...prev.filter(e => e !== data.username)])
    }

    socket.on("joined-lobby", handleOtherUser)
    socket.on("existing-users", handleExistingUsers)
    socket.on("user-left", handleUserLeft)


    return () => {
      socket.disconnect()
      socket.off("joined-lobby", handleOtherUser)
      socket.off("existing-users", handleExistingUsers)
      socket.off("user-left", handleUserLeft)
    }
  }, [])

  function joinLobby() {
    socket.emit("join-lobby", {lobby: "lobby", username: username})
    setPage("lobby")
  }

  const responseMessage = (response) => {
    console.log(response);
  };
  
  const errorMessage = (error) => {
    console.log(error);
  };

  return (
    <div className="App">
      {page === "login" ? <Login username={username} setUsername={setUsername} joinLobby={joinLobby}/>
       : page === "lobbyselector" ? <LobbySelector/>
       :  page === "lobby" ? <Lobby lobbyUsers={lobbyUsers}/>
       : page === "game" ? <Game/>
       : page === "postgame" ? <PostGame/>
       : <div/>
      }
      <div>
        <h2>React Google Login</h2>
        <br />
        <br />
        <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
      </div>
    </div>
  );
}

export default App;
