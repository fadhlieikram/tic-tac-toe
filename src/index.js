import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} />
    );
  }

  render() {
      const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

      return (
        <div>
          {rows.map((cols, idx) => 
          <div key={idx} className="board-row">
            {cols.map(col => this.renderSquare(col))}
          </div> )
          }
        </div>
      );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const currentMove = history[history.length - 1];
    const squares = currentMove.squares.slice();

    // skip the rest if a player has won
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{ squares: squares, }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });

  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const currentMove = history[this.state.stepNumber];
    const winner = calculateWinner(currentMove.squares);

    const moves = history.map((squares, index) => {
      const desc = index ? 'Go to move #' + index : 'Go to game start';

      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)} >{desc}</button>
        </li>
      );
    });

    let status;

    if (winner != null) {
      status = 'Winner is ' + winner;
    } else {
      status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={currentMove.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

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

    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
