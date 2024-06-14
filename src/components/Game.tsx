import { useEffect, useState } from "react";
import Grid from "./Grid.tsx";
import React from "react";
import Instructions from "./Instructions.tsx";
import SizeCounter from "./SizeCounter.tsx";
import Arrow from "./Arrow.tsx";

// These elements allow the Grid, when clicked, to affect the status of the Game, using the global scope.
var clickedTile = -1; // the clicked square in question.
var clickAction = false; // true if a click action is being processed.

const cellClickHandler = ( cellno : number ) => {
  clickAction = true;
  clickedTile = cellno;
}

export default function Game() {
  const [ size, setSize ] = useState(5);
  const [ solveStatus, setSolveStatus ] = useState(1); // 0: unsolved, 1: solved, 2: solving, 3: messed from unsolved
  const [ grid, setGrid ] = useState<number[]>(Array(25).fill(0));
  const [ moves, setMoves ] = useState(0);

  const LeftArrowHandler = () => {
    if (size >= 3) { // min size is 2
      const newSize = size - 1;
      setSize(newSize);
      setGrid(Array(newSize * newSize).fill(0));
    }
  }

  const RightArrowHandler = () => {
    if (size <= 998) { // min size is 999
      const newSize = size + 1;
      setSize(newSize);
      setGrid(Array(newSize * newSize).fill(0));
    }
  }

  const update = () => {
    if (clickedTile !== -1) { // change has happened
      const changed = clickedTile;
      clickedTile = -1;
      clickAction = false;

      click(changed);
    }
  }

  const scramble = () => {
    let i: number;

    // resetting the puzzle
    if (solveStatus === 0 || solveStatus === 2) {
      for (i = 0; i < size * size; i++) {
        click(Math.floor(Math.random() * size * size));
      }
    }

    // ensure puzzle will be unsolved
    while (checkSolved()) {
      for (i = 0; i < size * size; i++) {
        click(Math.floor(Math.random() * size * size));
      }
    }

    setSolveStatus(0);
    setMoves(0);
  }

  const checkSolved = () => {
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

  const click = (tile : number) => {

    const g = grid;

    g[tile] ^= 1; // flip current tile
    if (tile >= size) g[tile - size] ^= 1; // tile above
    if (tile < ((size - 1) * size)) g[tile + size] ^= 1; // tile below
    if (tile % size !== 0) g[tile - 1] ^= 1; // tile to the left
    if (tile % size !== size - 1) g[tile + 1] ^= 1; // tile to the right

    setGrid(g);

    let curMoves = moves + 1;

    if ((solveStatus === 0 || solveStatus === 2) && checkSolved()) {
      // playing an actual game and move solves the game
      setSolveStatus(1);
      alert("Good job! Moves: " + (moves + 1).toString());
      setMoves(0);
    } else if (solveStatus === 0 || solveStatus === 2) {
      // playing an actual game and move does not solve the game
      setSolveStatus(2);
      setMoves(curMoves);
    } else if (checkSolved()) { 
      // playing around and solved
      setSolveStatus(1);
      setMoves(0);
    } else {
      // playing around and move does not solve the game
      setSolveStatus(3);
    }    
  }

  return (
    <div onClick={update} className="game">
      <h1 className="game-top">
        <span onClick={LeftArrowHandler}><Arrow dir="left" size={size} /></span><SizeCounter size={size}/><span onClick={RightArrowHandler}><Arrow dir="right" size={size} /></span>
      </h1>
      <Grid status={grid} size={size} clickHandler={ cellClickHandler } />
      <button className="scramble btn btn-primary" id="scramble-btn" onClick={scramble}>Scramble</button>
      <Instructions solveStatus={solveStatus} moves={moves} />
    </div>
  );

}

window.onload = function() {
  document.addEventListener("keypress", (e) => {
    console.log(e.code);
    if (e.code === "Space") {
      document.getElementById("scramble-btn")?.click();
    } /*else if (e.code === "LeftArrow") {
      document.getElementById("left-arrow").click();
    } else if (e.code === "RightArrow") {
      document.getElementById("right-arrow").click();
    }*/
  });
}