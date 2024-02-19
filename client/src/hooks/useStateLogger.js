import { useEffect } from 'react';

export default function useStateLogger(state, stateName) {
  useEffect(() => {
    console.log(`[${stateName}]`, state);
  }, [state]);
}
