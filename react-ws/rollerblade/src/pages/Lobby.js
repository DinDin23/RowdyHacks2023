export default function Lobby(props) {
  return (
    <div>
      {props.lobbyUsers.map((e, i) => <p key={i}>{e}</p>)}
      <button onClick={() => props.setPage("game")}>Start Game</button>
    </div>
  )
}