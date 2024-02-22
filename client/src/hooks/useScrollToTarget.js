import { useEffect } from 'react';

function useScrollToTarget(ref, dependency = [], isOnDefault, needPrevRef, prevLastReadRef) {
  const scrollToTarget = () => {
    const target = ref.current;
    // console.log('scrollToTarget called. \ntarget :', target);
    target?.scrollIntoView();
  };

  const scrollToLastRead = () => {
    const lastRead = prevLastReadRef.current;
    lastRead?.scrollIntoView({
      block: 'center',
    });
  };

  useEffect(() => {
    if (needPrevRef) {
      scrollToLastRead();
    } else if (isOnDefault) {
      scrollToTarget();
    }
  }, [needPrevRef, ...dependency]);

  const handleScrollToTarget = (func) => {
    // console.log('handleScrollToTarget called');
    if (func) func();
    scrollToTarget();
  };

  return {
    scrollToTarget,
    handleScrollToTarget,
  };
}

export default useScrollToTarget;
