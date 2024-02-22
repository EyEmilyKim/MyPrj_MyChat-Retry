import { useEffect, useState } from 'react';

export default function useIndexOfLastMessage(groupedMessages, previousLastRead) {
  const [indexOfLastMessage, setIndexOfLastMessage] = useState(previousLastRead);
  const [needPrevRef, setNeedPrevRef] = useState(false);

  useEffect(() => {
    if (Object.keys(groupedMessages).length !== 0) {
      const keysArray = Object.keys(groupedMessages);
      const lastKey = keysArray[keysArray.length - 1];
      const lastArrayElement = groupedMessages[lastKey][groupedMessages[lastKey].length - 1];
      // console.log('lastArrayElement', lastArrayElement);
      setIndexOfLastMessage(lastArrayElement.index);

      if (lastArrayElement.index !== previousLastRead) setNeedPrevRef(true);
    }
  }, [groupedMessages]);

  return { indexOfLastMessage, needPrevRef };
}
