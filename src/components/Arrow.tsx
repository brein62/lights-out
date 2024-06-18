import React from "react";

/**
 * 
 */
export default function Arrow({ size, dir, displaySize = 60 } : { size : number, dir : string, displaySize? : number }) {
  let btnClassL = size === 2 ? "btn-arrow-disabled" : "btn-arrow";   // disable left arrow button if size is 2.
  let btnClassR = size === 999 ? "btn-arrow-disabled" : "btn-arrow"; // disable right arrow button if size is 999.

  if (dir === "left") {
    return (
      <svg id="left-arrow" className={btnClassL} width={displaySize} height={displaySize} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 30 L60 0 L60 60"/>
      </svg>
    );
  } else if (dir === "right") {
    return (
      <svg id="right-arrow" className={btnClassR} width={displaySize} height={displaySize} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 30 L0 0 L0 60"/>
      </svg>
    );
  } else {
    console.log("Error: The arrow dir attribute is not 'left' or 'right'.")
    return <>Check console.</>
  }
}