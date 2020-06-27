import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Button } from '@material-ui/core';

function Square(props) {
  return (
    <Button
    variant='outlined'
    color='primary'
    className='square'
    onClick={props.onClick}>
      {props.value}
    </Button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    const rows = [];
    for (let i = 0; i < 3; ++i) {
      const row = [];
      for (let j = 0; j < 3; ++j) {
        row.push(this.renderSquare(3 * i + j));
      }
      rows.push(<div key={i} className="board-row">{ row }</div>);
    }

    return (
      <div>{ rows }</div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat({
        squares: squares
      }),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((_, step) => {
      let desc = step > 0 ? 
        'Go to move #' + step : 
        'Go to game start';

      return (
        <li key={step}>
          <Button 
            variant='outlined'
            color='primary'
            onClick={() => this.jumpTo(step)}> {
            step === this.state.stepNumber ? 
              <strong>{desc}</strong> :
              desc
          } </Button>
        </li>
      )
    })

    let status = 'Winner: ' + winner + '!';
    if (!winner) {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    else
    if (winner === 'DRAW') {
      status = "It's a draw!";
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
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
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  let countX = 0;
  let countO = 0;
  for (let player of squares) {
    if (player === 'X') {
      ++countX;
    }
    else
    if (player === 'O') {
      ++countO;
    }
  }

  if (countX + countO === 9) return 'DRAW';

  return null;
}
