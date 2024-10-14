import { useState } from "react";

function Square({ value, onSquareClick, winningSquare }) {
  return (
    <button
      className={winningSquare ? "square winning-square" : "square"}
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  let winningSquares = Array(3).fill(-1);

  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) {
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[i] = xIsNext ? "X" : "O";
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);

  let status;

  status = winner ? "Winner: " + squares[winner[0]] : "Next player: " + (xIsNext ? "X" : "O");
  const rows = Array(3).fill(null);
  return (
    <>
      <div className="status">{status}</div>
      {rows.map((value, rowindex) => (
        <div className="board-row">
          {rows.map((value, columnindex) => (
            <Square winningSquare={(winningSquares[0] === rowindex * 3 + columnindex || winningSquares[1] === rowindex * 3 + columnindex || winningSquares[2] === rowindex * 3 + columnindex)} value={squares[rowindex * 3 + columnindex]} onSquareClick={() => handleClick(rowindex * 3 + columnindex)} />
          ))}
        </div>
      ))}
      {/* <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div> */}
    </>
  );

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winningSquares = lines[i];
        return (lines[i]);
      }
    }
    return null;
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sortAscending, setSortAscending] = useState(true);

  function toggleListAscending() {
    setSortAscending(!sortAscending);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  let moves = history.map((squares, move) => {
    let description;
    if (move === history.length - 1) {
      description = "You are at move #" + move;
    }
    else if (move > 0) {
      description = 'Go to move #' + move;
    }
    else {
      description = "Go to game start";
    }

    return (
      <>
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
      </>
    );
  });

  if (!sortAscending) {
    moves = moves.reverse();
  }


  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}></Board>
      </div>
      <div className="game-info">
        <button onClick={toggleListAscending}>Toggle sort</button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
