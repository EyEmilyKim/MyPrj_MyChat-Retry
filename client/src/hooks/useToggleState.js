import React, { useState } from 'react';

export default function useToggleState(initialState) {
  const [state, setState] = useState(initialState);

  const toggleState = () => {
    setState(!state);
  };

  return [state, toggleState, setState];
}
