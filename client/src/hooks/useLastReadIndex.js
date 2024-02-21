import { useEffect, useState } from 'react';

export default function useLastReadIndex(ref, groupedMessages, isOnDefault) {
  const [lastReadIndex, setLastReadIndex] = useState(0);

  const saveLastReadIndex = () => {
    const keysArray = Object.keys(groupedMessages);
    const lastKey = keysArray[keysArray.length - 1];
    const lastArrayElement = groupedMessages[lastKey][groupedMessages[lastKey].length - 1];
    setLastReadIndex(lastArrayElement.index);
  };

  useEffect(() => {
    if (ref.current && isOnDefault) {
      saveLastReadIndex();
    }
  }, [groupedMessages, isOnDefault]);

  return { lastReadIndex };
}
