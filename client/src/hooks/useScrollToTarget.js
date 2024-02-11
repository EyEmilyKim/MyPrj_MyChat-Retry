import { useEffect } from 'react';

export default function useScrollToTarget(ref, dependency = []) {
  const scrollToTarget = () => {
    const target = ref.current;
    console.log('scrollToTarget called. \ntarget :', target);
    target?.scrollIntoView();
  };

  useEffect(() => {
    scrollToTarget();
  }, dependency);
}
