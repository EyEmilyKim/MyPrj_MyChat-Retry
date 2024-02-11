import React, { useEffect } from 'react';

export default function useScrollToBottomInDelay(ref, delay = 0, dependency = [], isUserScrolling) {
  const scrollToBottom = () => {
    const container = ref.current;
    console.log('scrollToBottom called. \ncontainer :', container);
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  };

  useEffect(() => {
    if (!isUserScrolling) {
      setTimeout(() => {
        scrollToBottom();
      }, delay);
    }
  }, dependency);
}
