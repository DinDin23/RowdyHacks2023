import logo from './logo.svg';
import {useEffect, useState} from "react"
import './App.css';
import { io } from "socket.io-client"
const URL = 'http://localhost:4000';

const socket = io(URL, {
  autoConnect: false
});

function App() {
  const [lobbyUsers, setLobbyUsers] = useState([])
  const [username, setUsername] = useState("")
  const [connected, setConnected] = useState(false)


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
    setConnected(true)
  }

  return (
    <div className="App">
      {connected ? <div>
        {lobbyUsers.map((e, i) => <p key={i}>{e}</p>)}
      </div>
        : <div>
        <input style={{width: 500}} value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <button onClick={joinLobby}>join lobby</button>
      </div>
      }
    </div>
  );
}

export default App;
