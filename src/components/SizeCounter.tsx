import React from 'react';

export default function SizeCounter({ size } : { size : number }) {
  // if above 3 digit grid size, make text smaller.
  if (size >= 100) {
    return <span className="align-middle sizecounter-small">{ size } &times; { size }</span>;
  } else {
    return <span className="align-middle sizecounter">{ size } &times; { size }</span>;
  }
}