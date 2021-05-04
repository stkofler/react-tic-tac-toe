/* eslint-disable max-classes-per-file */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

interface SquareProps {
  value: string,
  winningSquare: string,
  onClick: () => void,
}

function Square(props: SquareProps) {
  return (
    <button
      type="button"
      className={`square ${props.winningSquare}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

type SquareType = string | null;
interface BoardProps {
  winningCombo: number[],
  squares: SquareType[],
  onClick: (i: number) => void,
}

const Board = (props: BoardProps) => {
  const renderSquare = (i: number) => {
    const { winningCombo, squares } = props;
    const winningSquare = winningCombo && winningCombo.includes(i) ? 'winning-square' : '';
    return (
      <Square
        winningSquare={winningSquare}
        value={squares[i] || ''}
        onClick={() => props.onClick(i)}
      />
    );
  };

  return (
    <div>
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

interface MoveHistory {
  squares: SquareType[],
  lastMove: number,
}

interface GameState {
  history: MoveHistory[],
  xIsNext: boolean,
  stepNumber: number,
}

type GameProps = Record<string, unknown>;
type GameResult = {
  winner: string,
  winningCombo: number[],
} | undefined;

class Game extends React.Component<GameProps, GameState> {
  static initialState(): GameState {
    return {
      history: [{ squares: Array.from({ length: 9 }), lastMove: 0 }],
      xIsNext: true,
      stepNumber: 0,
    };
  }

  static calculateWinner(squares: SquareType[]): GameResult {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // horizontal
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // vertical
      [0, 4, 8], [2, 4, 6], // diagonal
    ];

    for (const line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as string, winningCombo: line };
      }
    }
    return undefined;
  }

  static getPlayerString(xIsNext: boolean) {
    return xIsNext ? 'X' : 'O';
  }

  constructor(props: GameProps) {
    super(props);
    this.state = Game.initialState();
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = [...current.squares];
    if (Game.calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = Game.getPlayerString(this.state.xIsNext);
    this.setState((previousState) => ({
      history: [...history, { squares, lastMove: i }],
      stepNumber: history.length,
      xIsNext: !previousState.xIsNext,
    }));
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  restartGame(): void {
    this.setState(Game.initialState());
  }

  render() {
    const { history, xIsNext, stepNumber } = this.state;
    const current = history[stepNumber];
    const result = Game.calculateWinner(current.squares);
    let status = `Next player: ${Game.getPlayerString(xIsNext)}`;
    let winningCombo: number[] = [];
    if (result) {
      status = `Winner: ${result.winner}`;
      winningCombo = result.winningCombo;
    }

    const locationList = ['(1,1)', '(2,1)', '(3,1)', '(1,2)', '(2,2)', '(3,2)', '(1,3)', '(2,3)', '(3,3)'];
    const moves = history.map((step, move) => {
      if (move === 0) return '';
      const location = locationList[step.lastMove];
      const desc = `Move #${move} at coords ${location}`;

      const className = stepNumber === move ? 'highlight-listitem' : '';
      return (
        // eslint-disable-next-line react/no-array-index-key
        <button key={move} type="button" className={className} onClick={() => this.jumpTo(move)}>{desc}</button>
      );
    });

    if (stepNumber === 9 && !result) {
      status = 'Game ends in a draw!';
    }

    return (
      <div className="game">
        <div className="game-info star-wars">
          <div className="crawl">
            {moves}
            <div className="next-player">
              <div>{status}</div>
            </div>
          </div>
          <div className="fade" />
        </div>
        <div className="game-board">
          <Board
            winningCombo={winningCombo}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="new-game">
          <button type="button" onClick={() => this.restartGame()}>Start a New Game!</button>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root'),
);
