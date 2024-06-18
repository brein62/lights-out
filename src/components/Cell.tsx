import React from "react";

export default function Cell({ cellno, value, clickHandler } : { cellno : number, value : number, clickHandler: ( cellno : number ) => void }) {

  
  return (
    <td onClick={() => clickHandler(cellno)} style={{backgroundColor: value === 1 ? "black" : "white"}} className="grid-cell">

    </td>
  )
}