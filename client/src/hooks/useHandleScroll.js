import { useState } from 'react';

export default function useHandleScroll() {
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // 사용자가 빠르게 연속된 이벤트 입력하는 경우, 일정 시간 대기 후 마지막 입력에 대해서만 처리
  // -> 스크롤중 모든 순간 불필요한 작업 말고, 사용자가 스크롤 멈춘 후에만 작업 수행되도록
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleScroll = debounce((func) => {
    setIsUserScrolling(true);
    console.log('스크롤 중...');
    console.log('func', func);
    if (func) func();
    console.log('handleScroll done');
  }, 200); // 이벤트 디바운싱을 위한 대기 시간

  return {
    isUserScrolling,
    handleScroll,
    setIsUserScrolling,
  };
}
