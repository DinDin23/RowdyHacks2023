import { useState } from "react"

export default function LobbySelector(props) {
  const [newLobbyName, setNewLobbyName] = useState("")

  function selectLobby(lobby) {
    props.joinLobby(lobby)
    props.setPage("lobby")
  }
  
  function createNewLobby(lobbyName) {
    props.setLobbies(prev => [...prev, lobbyName])
    selectLobby(lobbyName)
  }

  return (
    <div className="flexColumn">
      <h2>Lobbies</h2>
      <button onClick={props.fetchLobbies} style={{marginBottom: 40}}>Refresh</button>
      {props.lobbies && props.lobbies.map((e, i) => <div key={i} className="lobby" onClick={() => selectLobby(e)}>
        <p>{e}</p>
      </div>)}
      <input style={{width: 400, marginTop: 25}} value={newLobbyName} placeholder="Lobby Name" onChange={(e) => setNewLobbyName(e.target.value)}/>
      <button onClick={() => createNewLobby(newLobbyName)}>Create New Lobby</button>
    </div>
  )
}