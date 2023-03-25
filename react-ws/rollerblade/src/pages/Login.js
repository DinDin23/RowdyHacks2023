export default function Login(props) {
  return (
    <div>
      <input style={{width: 500}} value={props.username} onChange={(e) => props.setUsername(e.target.value)}></input>
      <button onClick={props.joinLobby}>join lobby</button>
    </div>
  )
}