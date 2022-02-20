import { useEffect, useRef } from 'react';

/**
 * 返回组件的挂载状态，如果还没有挂载或者已经被卸载，则返回false，否则返回true
 */
export default function useMountedRef() {
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  });

  return mountedRef;
};
