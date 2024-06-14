import React from "react";
import Cell from "./Cell.tsx";

// generates a designed grid based on two props, size and grid status.
export default function Grid({ size, status, clickHandler } : { size : number, status: number[], clickHandler: ( cellno : number ) => void }) {
  let buffer = [] as React.ReactNode[]; // array of tr to be displayed in table

  for (let i = 0; i < size; i++) {
    let buffer2 = [] as React.ReactNode[]; // array of td to be put in tr
    for (let j = 0; j < size; j++) {
      const cellno = i * size + j;
      buffer2.push(<Cell value={status[cellno]} cellno={cellno} clickHandler={ clickHandler } />);
    }

    buffer.push(<tr>{buffer2}</tr>);
  }

  return (
    <table border={1}>
      <tbody>
        {buffer}
      </tbody>
    </table>
  )
}