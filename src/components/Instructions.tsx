import React from "react";

export default function Instructions({ solveStatus, moves } : { solveStatus : number, moves : number }) {
  const solveColor = (solveStatus === 1) ? "green"
                    : (solveStatus === 0) ? "red"
                    : (solveStatus === 2) ? "yellow"
                    : "orange";
  const solveType = (solveStatus === 1) ? "Solved"
                    : (solveStatus === 0) ? "Unsolved"
                    : (solveStatus === 2) ? "Solving"
                    : "Playing Around";

  // just a normal instructions page
  return (
    <div id="instructions">
      <p><strong>Goal: </strong>The main objective of this game is to make all the black tiles white.</p>
      <p><strong>Game Status: <span style={{color: solveColor}}>{solveType}</span></strong></p>
      <p><strong>Moves: </strong>{moves}</p>
    </div>
  )
}