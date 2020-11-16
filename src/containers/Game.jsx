import React from 'react';
import { connect } from 'react-redux';

import { updateHistory, updateStepNumber, updatePlayer } from '../actions';

const mapStateToProps = state => ({
    history: state.history,
    stepNumber: state.stepNumber,
    xIsNext: state.xIsNext,
})

const mapDispatchToProps = dispatch => {
    return {
        _updateHistory: (newSqaureArr) => dispatch(updateHistory(newSqaureArr)),
        _updateStepNumber: (stepNumber) => dispatch(updateStepNumber(stepNumber)),
        _updateXIsNext: (xIsNext) => dispatch(updatePlayer(xIsNext)),
    }
}

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick = {() => this.props.onClick(i)}
            />
    )}
    
    render() {
        return (
            <div>
                <div className='board-row'>
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        )
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(i) {
        const { 
            history, stepNumber, xIsNext,
            _updateHistory, _updateStepNumber, _updateXIsNext, 
        } = this.props;
        const currentHistory = history.slice(0, stepNumber+1);
        const current = currentHistory[currentHistory.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = xIsNext ? "X" : "O";

        this.setState({
            // history: history.concat([
            //     {
            //         squares: squares
            //     }
            // ]),
            // stepNumber: stepNumber + 1,
            // xIsNext: !xIsNext,
        })
        _updateHistory(history.concat([{squares: squares}]))
        _updateStepNumber(stepNumber+1);
        _updateXIsNext(!xIsNext);
    }

    jumpTo(step) {
        const { _updateStepNumber, _updateXIsNext } = this.props;
        _updateStepNumber(step);
        _updateXIsNext((step % 2) === 0);
      }

    render() {
        const { history, stepNumber, xIsNext } = this.props;
        const currentHistory = history.slice(0, stepNumber+1);
        const current = currentHistory[currentHistory.length - 1];
        console.log(this.props);
        
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            )
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>
                        {/* <button onClick={this.handleClick} > click </button> */}
                        <div>Step Number: {stepNumber}</div>
                        <div>Next Player: { xIsNext ? 'X' : 'O' }</div>
                    </div>
                    <div>{moves}</div>
                </div>
            </div>
        )
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
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);