import { useEffect, useState } from 'react';
import { debounce } from '../utils/debounce';

export default function useHandleScroll(ref, log = false) {
  const [isOnBottom, setIsOnBottom] = useState(true);
  const [isOnTop, setIsOnTop] = useState(true);
  const debounceTime = 200; // 이벤트 디바운싱을 위한 대기 시간
  const tolerance = 1.4; // 오차 범위 설정 (for scrollTop 소수점 이하)

  // 스크롤할 때마다 위치 확인
  const handleScroll = debounce(() => {
    console.log('스크롤...');

    const scrollTop = ref.current.scrollTop; // 현재 스크롤 위치
    const scrollHeight = ref.current.scrollHeight; // 스크롤 가능한 전체 높이
    const clientHeight = ref.current.clientHeight; // 현재 보이는 창의 높이
    // 최상단 여부 확인
    if (scrollTop == 0) setIsOnTop(true);
    else setIsOnTop(false);
    // 최하단 여부 확인
    if (scrollTop + clientHeight + tolerance >= scrollHeight) setIsOnBottom(true);
    else setIsOnBottom(false);

    // 필요 시 스크롤 위치정보 출력
    if (log) {
      console.log(
        `scrollTop : ${scrollTop}, scrollHeight : ${scrollHeight}, \n` +
          `clientHeight : ${clientHeight}\n` +
          `scrollTop + clientHeight + tolerance = ${scrollTop + clientHeight + tolerance}`
      );
    }
  }, debounceTime);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [ref, handleScroll]);

  return {
    isOnBottom,
    isOnTop,
  };
}
