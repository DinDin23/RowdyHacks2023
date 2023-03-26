export default function Lobby(props) {
  return (
    <div className="flexColumn">
      {props.lobbyUsers && props.lobbyUsers.map((e, i) => <p key={i}>{e}</p>)}
      <button onClick={props.startGame}>Start Game</button>
      <button onClick={props.leaveLobby}>Leave Lobby</button>
    </div>
  )
}