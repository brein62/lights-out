import { useEffect, useState } from "react";
import GameGrid from "./GameGrid.tsx";
import React from "react";
import Instructions from "./Instructions.tsx";
import SizeCounter from "./SizeCounter.tsx";
import Arrow from "./Arrow.tsx";
import { Button, Stack } from "react-bootstrap";
import WinModal from "./WinModal.tsx";

// These elements allow the Grid, when clicked, to affect the status of the Game, using the global scope.
var clickedTile = -1; // the clicked square in question.
var clickAction = false; // true if a click action is being processed.

const cellClickHandler = ( cellno : number ) => {
  console.log("click on", cellno);
  clickAction = true;
  clickedTile = cellno;
}

export default function Game() {
  const [ size, setSize ] = useState(5);
  const [ solveStatus, setSolveStatus ] = useState(1); // 0: unsolved, 1: solved, 2: solving, 3: messed from unsolved
  const [ grid, setGrid ] = useState<number[]>(Array(25).fill(0));
  const [ moves, setMoves ] = useState(0);
  const [ show, setShow ] = useState(false);
  const [ showMoves, setShowMoves ] = useState(0);

  const keyPress = (e : KeyboardEvent) => {
      console.log(e.code);
      if (e.code === "Space") {
        e.preventDefault();
        scramble();
      } else if (e.code === "ArrowLeft" || e.code === "KeyA") {
        LeftArrowHandler();
      } else if (e.code === "ArrowRight" || e.code === "KeyD") {
        RightArrowHandler();
      } else if (e.code === "Escape" || e.code === "KeyR") {
        reset(size);
      } else if (show) {
        handleClose();
      }
  }

  useEffect(() => {
    window.addEventListener("keydown", keyPress);

    return () => window.removeEventListener("keydown", keyPress);
  }, [keyPress]);

  const LeftArrowHandler = () => {

    if (show) {
      handleClose();
      return;
    }

    if (size >= 3) { // min size is 2
      const newSize = size - 1;
      setSize(newSize);
      reset(newSize);
    }
  }

  const RightArrowHandler = () => {

    if (show) {
      handleClose();
      return;
    }

    if (size <= 998) { // min size is 999
      const newSize = size + 1;
      setSize(newSize);
      reset(newSize);
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
    
    if (show) {
      handleClose();
      return;
    }

    let i: number;

    // resetting the puzzle
    //if (solveStatus === 0 || solveStatus === 2) {

      // reset puzzle to solved state
      let g = getSolvedGrid(size);

      // ensure puzzle will be unsolved
      while (checkSolved(g)) {
        for (i = 0; i < size * size; i++) {
          g = moveGrid(Math.floor(Math.random() * size * size), size, g);
        }
      }

      console.log(g);

      setGrid(g);
    //}

    setSolveStatus(0);
    setMoves(0);
  }

  const getSolvedGrid = (size : number) => {
    return Array(size * size).fill(0);
  }

  const checkSolved = (g : number[]) => {
    let isSolved = true;
    // check if all cells are white (equal to 0)
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const tile = i * size + j;
        isSolved &&= (g[tile] === 0);
      }
    }
    return isSolved;
  }

  const moveGrid = (tile : number, size : number, grid : number[]) => {
    grid[tile] ^= 1; // flip current tile
    if (tile >= size) grid[tile - size] ^= 1; // tile above
    if (tile < ((size - 1) * size)) grid[tile + size] ^= 1; // tile below
    if (tile % size !== 0) grid[tile - 1] ^= 1; // tile to the left
    if (tile % size !== size - 1) grid[tile + 1] ^= 1; // tile to the right
  
    return grid;
  }

  const reset = (size : number) => {

    if (show) {
      handleClose();
      return;
    }

    setSolveStatus(1);
    setMoves(0);
    setGrid(getSolvedGrid(size));
  }

  // for modal
  const handleShow = (moves : number) => {
    setShow(true);
    setShowMoves(moves);
  }

  const handleClose = () => {
    setShow(false);
    setShowMoves(0);
    setMoves(0);
  }

  const click = (tile : number) => {

    const g = moveGrid(tile, size, [...grid]);

    setGrid(g);

    let curMoves = moves + 1;

    if ((solveStatus === 0 || solveStatus === 2) && checkSolved(g)) {
      // playing an actual game and move solves the game
      setSolveStatus(1);
      setMoves(moves + 1);
      handleShow(moves + 1);
    } else if (solveStatus === 0 || solveStatus === 2) {
      // playing an actual game and move does not solve the game
      setSolveStatus(2);
      setMoves(curMoves);
    } else if (checkSolved(g)) { 
      // playing around and solved
      setSolveStatus(1);
      setMoves(0);
    } else {
      // playing around and move does not solve the game
      setSolveStatus(3);
    }    
  }

  return (
    <div onClick={update} className="game container">
      <Stack gap={3}>
        <h1 className="game-top">
          <span onClick={LeftArrowHandler}><Arrow dir="left" size={size} displaySize={45} /></span><SizeCounter size={size}/><span onClick={RightArrowHandler}><Arrow dir="right" size={size} displaySize={45} /></span>
        </h1>
        <GameGrid status={grid} size={size} clickHandler={ cellClickHandler } />
        <Stack direction="horizontal" className="justify-content-center" gap={2}>
          <Button className="scramble" variant="primary" id="scramble-btn" onClick={scramble}>Scramble</Button>
          <Button className="scramble" variant="secondary" id="reset-btn" onClick={() => reset(size)}>Reset</Button>
        </Stack>
        <Instructions solveStatus={solveStatus} moves={moves} />
        <WinModal show={ show } handleClose={handleClose} moves={showMoves}/>
      </Stack>
    </div>
  );

}