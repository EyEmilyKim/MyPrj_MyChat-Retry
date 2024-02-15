import { useEffect, useState } from 'react';

export default function useLastReadIndex(ref, list = [], isOnDefault) {
  const [lastReadIndex, setLastReadIndex] = useState(0);

  const saveLastReadIndex = () => {
    setLastReadIndex(list[list.length - 1].index);
  };

  useEffect(() => {
    if (ref.current && isOnDefault) {
      saveLastReadIndex();
    }
  }, [list, isOnDefault]);

  return { lastReadIndex };
}
