import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square (props) {
    return (
      <button
      className="square"
      onClick={() => props.onClick() }>
        {props.value}
      </button>
    );
}


function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7 ,8],
    [0, 3, 6],
    [1, 4 ,7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for(let i = 0; i < lines.length; i++) {
    const [a, b , c] = lines[i];
    if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
    {
      return squares[a];
    }
  }

  return null;
}

class Board extends React.Component {

  renderSquare(i) {
    return <Square 
    value={this.props.squares[i]}
    onClick={() => this.props.onClick(i)} />;
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

class Game extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.splice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const location = current.location.slice();


    document.getElementById(this.state.stepNumber).style.fontWeight = "normal";
    // eslint-disable-next-line
    document.getElementById(this.state.stepNumber + 1) === null ? "" :
        document.getElementById(this.state.stepNumber + 1).style.fontWeight = "bold";
    
    console.log(this.state.stepNumber + 1);

    if(calculateWinner(squares) || squares[i]) {
      return;
    }
    location[this.state.stepNumber + 1] = this.colRow(i);
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        location: location
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    document.getElementById(this.state.stepNumber).style.fontWeight = "normal";
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });

    document.getElementById(step).style.fontWeight = "bold";
  }

  colRow(i) {
    const col = [
      [0, 1 ,2],
      [3, 4, 5],
      [6 ,7 ,8]
    ];

    for(let j = 0; j < col.length; j++){
      for(let k = 0; k < col[j].length; k++) {
        if(col[j][k] === i){
          return ` X: ${col.indexOf(col[j]) + 1 } Y: ${col[j].indexOf(i) + 1}`;
        }
      }
    }
    return null;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move && step.location ? 'Go to move # ' + move + step.location[move] : 'Go to game start';

      return(
      <li key={move}>
        <button 
        onClick={() => this.jumpTo(move)} 
        style={{'fontWeight': 'bold'}}
        id={move}>{desc}</button>
      </li>);
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
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
