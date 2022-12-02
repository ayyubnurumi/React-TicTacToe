import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  const winningSquareStyle = {
    backgroundColor: '#33ff33',
    color: '#282828',
  };

  return (
    <button className="square primary-btn" onClick={props.onClick} style={props.winningSquare ? winningSquareStyle : null} >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    let winningSquare = this.props.winner && this.props.winner.includes(i) ? true : false;
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winningSquare = {winningSquare}
      />
    );
  }

  renderRow(row) {
    let squaresPerRow = 3;
    const squares = [];
    const offset = row * squaresPerRow;
    for (let s = 0; s < squaresPerRow; s++) {
      squares.push(this.renderSquare(offset + s));
    }
    return <div className="board-row">{squares}</div>;
  }

  render() {
    let totalRows = 3;
    const rows = [];
    for (let r = 0; r < totalRows; r++) {
      rows.push(this.renderRow(r));
    }
    return <div className="play-area">{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location: [0, 0],
        },
      ],
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: [Math.floor((i % 3) + 1), Math.floor(i / 3 + 1)],
          player: this.state.xIsNext ? "X" : "O",
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleSort() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      const desc = move
        ? `turn #${move}, player ${step.player} move to (${step.location[0]}, ${step.location[1]})`
        : "go to game start";
      return (
        <li key={move}>
          <button className="history-btn primary-btn" onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "The Winner is " + winner.winner;
    } else if(!current.squares.includes(null)) {
      status = "draw"
    } else {
      status = "Next player is " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => {
              this.handleClick(i);
            }}
            winner={winner && winner.winningSquares}
          />
        </div>
        <div className="game-info">
          <h1 className="status">{status}</h1>
          <ol className="history-list">{ascending ? moves : moves.reverse()}</ol>
          <button className="sort primary-btn" onClick={() => this.handleSort()}>sort by <strong>{ascending ? 'Descending' : 'Ascending'}</strong></button>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
      winningSquares:lines[i]};
    }
  }
  return null;
}
