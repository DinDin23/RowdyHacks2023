export default function PostGame(props) {
  return (
    <div className="flexColumn">
      <h2>{props.winner} won!</h2>
      <button onClick={() => props.setPage("lobbyselector")}>Back</button>
    </div>
  )
}