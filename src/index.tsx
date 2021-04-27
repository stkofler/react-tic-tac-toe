import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareProps = {
  value: string,
  winningSquare: string,
  onClick: () => void,
}

function Square(props: SquareProps) {
  return (
    <button
      className={`square ${props.winningSquare}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

type BoardProps = {
  winningCombo: number[],
  squares: string[],
  onClick: (i: number) => void, 
}

class Board extends React.Component {
  constructor (public props: BoardProps) {
    super(props);
  }

  renderSquare(i: number) {
    const winningCombo = this.props.winningCombo;
    const winningSquare = winningCombo && winningCombo.indexOf(i) > -1 ? 'winning-square' : '';
    return (
      <Square
        winningSquare={winningSquare}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)} 
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

type MoveHistory = {
  squares: string[],
  lastMove: number,
}

type GameState = {
  history: MoveHistory[],
  xIsNext: boolean,
  stepNumber: number,
}

type GameProps = {};

class Game extends React.Component<GameProps, GameState> {
  constructor (props: GameProps) {
    super(props);
    this.state = {
      history: [{ squares: Array(9).fill(null), lastMove: -1 }],
      xIsNext: true,
      stepNumber: 0,
    }
  }

  calculateWinner(squares: string[]) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], winningCombo: lines[i] };
      }
    }
    return null;
  }

  getPlayerString(xIsNext: boolean) {
    return xIsNext ? 'X': 'O';
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
    if (this.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.getPlayerString(this.state.xIsNext);
    this.setState({
      history: history.concat([{ squares, lastMove: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = this.calculateWinner(current.squares);
    let status = `Next player: ${this.getPlayerString(this.state.xIsNext)}`;
    let winningCombo: number[] = [];
    if (result) {
      status = `Winner: ${result.winner}`;
      winningCombo = result.winningCombo; 
    }

    const locationList = ['(1,1)', '(2,1)', '(3,1)', '(1,2)', '(2,2)', '(3,2)', '(1,3)', '(2,3)', '(3,3)'];
    const moves = history.map((step, move) => {
      const location = locationList[step.lastMove];
      const desc = move ? `Go to move #${move} at location: ${location}` : 'New Game';

      const className = this.state.stepNumber === move ? 'highlight-listitem' : ''; 
      return (
        <li key={move}>
          <button className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    if (this.state.stepNumber === 9 && !result) {
      status = 'Game ends in a draw!'; 
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winningCombo={winningCombo}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol className='move-history'>{moves}</ol>
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
