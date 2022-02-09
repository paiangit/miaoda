import { useState } from 'react';
import { useMountedRef } from './index';

interface State<D> {
  status: 'idle' | 'loading' | 'success' | 'error';
  data: D | null;
  error: Error | null;
}

const defaultInitialState = {
  status: 'idle',
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export function useAsync<D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) {
  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });
  const config = { ...defaultConfig, ...initialConfig };
  const mountedRef = useMountedRef();

  const setData = (data: D) =>
    setState({
      data,
      status: 'success',
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      data: null,
      status: 'error',
      error,
    });

  // run用来触发异步请求
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error('请传入 Promise 类型参数');
    }

    setState({ ...state, status: 'loading' });

    return promise
      .then((data) => {
        // 在组件已经被卸载时，不再调用setData
        mountedRef.current && setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        return Promise.reject(error);
      });
  };

  return {
    isIdle: state.status === 'idle',
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    run,
    setData,
    setError,
    ...state,
  };
}
