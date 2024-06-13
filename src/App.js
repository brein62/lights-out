import logo from './logo.svg';
import './App.css';
import React from 'react';
import useState from 'react';
import { toHaveDisplayValue, toHaveFocus } from '@testing-library/jest-dom/dist/matchers';
import { toHaveAccessibleDescription } from '@testing-library/jest-dom/dist/to-have-accessible-description';
import 'bootstrap/dist/css/bootstrap.css';
import { findRenderedComponentWithType } from 'react-dom/test-utils';

/**
 * 
 */
class Arrow extends React.Component {
  render() {
    let btnClassL = this.props.size === 2 ? "btn-arrow-disabled" : "btn-arrow";   // disable left arrow button if size is 2.
    let btnClassR = this.props.size === 999 ? "btn-arrow-disabled" : "btn-arrow"; // disable right arrow button if size is 999.

    if (this.props.dir === "left") {
      return (
        <svg id="left-arrow" className={btnClassL} width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 L60 0 L60 60"/>
        </svg>
      );
    } else if (this.props.dir === "right") {
      return (
        <svg id="right-arrow" className={btnClassR} width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 30 L0 0 L0 60"/>
        </svg>
      );
    } else {
      console.log("Error: The arrow dir attribute is not 'left' or 'right'.")
      return <>Check console.</>
    }
  }
}

// These elements allow the Grid, when clicked, to affect the status of the Game, using the global scope.
var clickedTile = -1; // the clicked square in question.
var clickAction = false; // true if a click action is being processed.

class SizeCounter extends React.Component {
  render() {
    // if above 3 digit grid size, make text smaller.
    if (this.props.size >= 100) {
      return <span className="align-middle sizecounter-small">{this.props.size} &times; {this.props.size}</span>;
    } else {
      return <span className="align-middle sizecounter">{this.props.size} &times; {this.props.size}</span>;
    }
  }
}

// generates a designed grid based on two props, size and grid status.
class Grid extends React.Component {
  render() {
    const size = this.props.size;
    const status = this.props.status;

    let buffer = []; // array of tr to be displayed in table

    for (let i = 0; i < size; i++) {
      let buffer2 = []; // array of td to be put in tr
      for (let j = 0; j < size; j++) {
        const cellno = i * size + j;
        buffer2.push(<Cell value={status[cellno]} number={cellno} />);
      }

      buffer.push(<tr>{buffer2}</tr>);
    }

    return (
      <table border="1">
        <tbody>
          {buffer}
        </tbody>
      </table>
    )
  }
}

class Instructions extends React.Component {
  render() {
    const solveColor = (this.props.solveStatus === 1) ? "green"
                     : (this.props.solveStatus === 0) ? "red"
                     : (this.props.solveStatus === 2) ? "yellow"
                     : "orange";
    const solveType = (this.props.solveStatus === 1) ? "Solved"
                     : (this.props.solveStatus === 0) ? "Unsolved"
                     : (this.props.solveStatus === 2) ? "Solving"
                     : "Playing Around";

    // just a normal instructions page
    return (
      <div id="instructions">
        <p><strong>Goal: </strong>The main objective of this game is to make all the black tiles white.</p>
        <p><strong>Game Status: <span style={{color: solveColor}}>{solveType}</span></strong></p>
        <p><strong>Moves: </strong>{this.props.moves}</p>
      </div>
    )
  }
}

class Cell extends React.Component {
  constructor() {
    super();
    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    clickAction = true;
    clickedTile = this.props.number;
  }

  render() {
    return (
      <td onClick={this.clickHandler} style={{backgroundColor: this.props.value === 1 ? "black" : "white"}} className="grid-cell"></td>
    )
  }
}

class Game extends React.Component {
  constructor() {
    super();

    this.state = {
      size: 5,
      solveStatus: 1, // 0: unsolved, 1: solved, 2: solving, 3: messed from unsolved
      grid: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      moves: 0
    };

    this.LeftArrowHandler = this.LeftArrowHandler.bind(this);
    this.RightArrowHandler = this.RightArrowHandler.bind(this);
    this.update = this.update.bind(this);
    this.scramble = this.scramble.bind(this);
    this.click = this.click.bind(this);
    this.checkSolved = this.checkSolved.bind(this);
  }

  LeftArrowHandler() {
    if (this.state.size >= 3) { // min size is 2
      const newSize = this.state.size - 1;
      this.setState({size: newSize});
      this.setState({grid: Array(newSize * newSize).fill(0)});
    }
  }

  RightArrowHandler() {
    if (this.state.size <= 998) { // max size is 999
      const newSize = this.state.size + 1;
      this.setState({size: newSize});
      this.setState({grid: Array(newSize * newSize).fill(0)});
    }
  }

  update() {
    if (clickedTile !== -1) { //change has happened
      const changed = clickedTile;
      clickedTile = -1;
      clickAction = false;

      this.click(changed);
    }
  }

  scramble() {
    const size = this.state.size;
    let i;
    // resetting the puzzle
    if (this.state.solveStatus === 0 || this.state.solveStatus === 2) {
      for (i = 0; i < size * size; i++) {
        this.click(Math.floor(Math.random() * size * size));
      }
    }
    // ensure puzzle will be unsolved
    while (this.checkSolved()) {
      for (i = 0; i < size * size; i++) {
        this.click(Math.floor(Math.random() * size * size));
      }
    }
    this.setState({solveStatus: 0});
    this.setState({moves: 0});
  }

  checkSolved() {
    let grid = this.state.grid;
    const size = this.state.size;
    let isSolved = true;
    // check if all cells are white (equal to 0)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = i * size + j;
        isSolved &&= (grid[tile] === 0);
      }
    }
    return isSolved;
  }
  
  click(tile) {
    let grid = this.state.grid;
    const size = this.state.size;
    grid[tile] ^= 1; // current tile
    if (tile >= size) grid[tile - this.state.size] ^= 1; // tile above
    if (tile < ((size - 1) * size)) grid[tile + size] ^= 1; // tile below
    if (tile % size !== 0) grid[tile - 1] ^= 1; // tile to the left
    if (tile % size !== size - 1) grid[tile + 1] ^= 1; // tile to the right

    this.setState({grid: grid});
    let curMoves = this.state.moves + 1;

    if ((this.state.solveStatus === 0 || this.state.solveStatus === 2) && this.checkSolved()) {
      // playing an actual game and move solves the game
      this.setState({solveStatus: 1});
      alert("Good job! Moves: " + (this.state.moves + 1).toString());
      this.setState({moves: 0});
    } else if (this.state.solveStatus === 0 || this.state.solveStatus === 2) {
      // playing an actual game and move does not solve the game
      this.setState({solveStatus: 2});
      this.setState({moves: curMoves});
    } else if (this.checkSolved()) { 
      // playing around and solved
      this.setState({solveStatus: 1});
      this.setState({moves: 0});
    } else {
      // playing around and move does not solve the game
      this.setState({solveStatus: 3});
    }
  }

  render() {
    return (
      <div onClick={this.update} className="game">
        <h1 className="game-top">
          <span onClick={this.LeftArrowHandler}><Arrow dir="left" size={this.state.size} /></span><SizeCounter size={this.state.size}/><span onClick={this.RightArrowHandler}><Arrow dir="right" size={this.state.size} /></span>
        </h1>
        <Grid status={this.state.grid} size={this.state.size} />
        <button className="scramble btn btn-primary" id="scramble-btn" onClick={this.scramble}>Scramble</button>
        <Instructions solveStatus={this.state.solveStatus} moves={this.state.moves} />
      </div>
    );
  }
}

window.onload = function() {
  document.addEventListener("keypress", (e) => {
    console.log(e.code);
    if (e.code === "Space") {
      document.getElementById("scramble-btn").click();
    } /*else if (e.code === "LeftArrow") {
      document.getElementById("left-arrow").click();
    } else if (e.code === "RightArrow") {
      document.getElementById("right-arrow").click();
    }*/
  });
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
