import { useState } from 'react';
import { debounce } from '../utils/debounce';

export default function useHandleScroll(detectTarget, initialIsOnDefault) {
  const [isOnBottom, setIsOnBottom] = useState(initialIsOnDefault);
  const [isOnTop, setIsOnTop] = useState(initialIsOnDefault);
  const debounceTime = 200; // 이벤트 디바운싱을 위한 대기 시간
  const tolerance = 1; // 오차 범위 설정 (for scrollTop 소수점 이하)

  // 현재 스크롤의 자세한 수치 확인
  const checkScroll = debounce(() => {
    const scrollTop = Math.round(detectTarget.scrollTop); // 현재 스크롤 위치 (정수로 반올림)
    const scrollHeight = detectTarget.scrollHeight; // 스크롤 가능한 전체 높이
    const clientHeight = detectTarget.clientHeight; // 현재 보이는 창의 높이
    console.log(
      `scrollTop : ${scrollTop}, scrollHeight : ${scrollHeight}, \n` +
        `clientHeight : ${clientHeight}`
    );
  }, debounceTime);

  // 현재 스크롤 최하단 여부 확인
  const checkIsOnBottom = debounce(() => {
    if (detectTarget.scrollTop + detectTarget.clientHeight + tolerance >= detectTarget.scrollHeight)
      setIsOnBottom(true);
    else setIsOnBottom(false);
  }, debounceTime);

  // 현재 스크롤 최상단 여부 확인
  const checkIsOnTop = debounce(() => {
    if (detectTarget.scrollTop == 0) setIsOnTop(true);
    else setIsOnTop(false);
  }, debounceTime);

  // 스크롤 시 작업내용을 함수로 받아 처리
  const handleScroll = debounce((func) => {
    console.log('스크롤 중...');
    // console.log('func', func);
    if (func) func();
    // console.log('handleScroll done');
  }, debounceTime);

  return {
    isOnBottom,
    isOnTop,
    checkScroll,
    checkIsOnBottom,
    checkIsOnTop,
    handleScroll,
  };
}
