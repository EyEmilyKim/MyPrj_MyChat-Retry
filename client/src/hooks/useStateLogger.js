import React, { useEffect } from 'react';

export default function useStateLogger(state, stateName) {
  useEffect(() => {
    if (Array.isArray(state)) {
      state.forEach((item, index) => {
        console.log(`[${stateName[index]}]`, item);
      });
    } else {
      console.log(`[${stateName}]`, state);
    }
  }, [state]);
}
