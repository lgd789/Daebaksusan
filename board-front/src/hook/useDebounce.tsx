import { useState, useEffect } from 'react';

// `T`는 제네릭 타입 파라미터입니다. 이를 통해 `useDebounce` 훅이 다양한 타입의 값을 처리할 수 있습니다.
export default function useDebounce<T>(value: T, delay: number): T {
  // 상태와 상태 설정 함수에도 동일한 타입 `T`를 사용합니다.
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // 타이머 설정. 지연 시간이 지난 후에 입력 값을 디바운스된 값으로 설정합니다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 컴포넌트가 언마운트되거나 다음 이펙트가 실행되기 전에 타이머를 정리합니다.
    return () => clearTimeout(timer);
  }, [value, delay]); // `value`와 `delay`가 변경될 때마다 이펙트를 다시 실행합니다.

  return debouncedValue;
}
