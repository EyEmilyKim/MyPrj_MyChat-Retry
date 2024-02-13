import { useState } from 'react';
import { debounce } from '../utils/debounce';

export default function useHandleScroll() {
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  const handleScroll = debounce((func) => {
    setIsUserScrolling(true);
    console.log('스크롤 중...');
    // console.log('func', func);
    if (func) func();
    // console.log('handleScroll done');
  }, 200); // 이벤트 디바운싱을 위한 대기 시간

  return {
    isUserScrolling,
    handleScroll,
    setIsUserScrolling,
  };
}
