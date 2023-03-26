export default function PostGame(props) {
  return (
    <div className="flexColumn">
      <h1>NeonBlader</h1>
      <h2>{props.winner} won!</h2>
      <h2>Thanks for playing!</h2>
      <button onClick={() => props.setPage("lobbyselector")}>Back</button>
    </div>
  )
}