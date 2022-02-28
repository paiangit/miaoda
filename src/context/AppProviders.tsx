import React, { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ErrorBoundary } from 'react-error-boundary';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'antd/dist/antd.less';
import '../styles/index.less';

import { ErrorFallback } from '../containers/ErrorFallback';
import store from '../store';

dayjs.locale('zh-cn');

function AppProviders({ children }: { children: ReactNode }) {
  const handleReset = () => {
    window.location.reload();
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      // 作用于useQuery（Get方法）
      queries: {
        // React 节点挂载时是否重新请求
        refetchOnMount: true,
        // 系统网络重连之后是否重新请求
        refetchOnReconnect: false,
        // 当浏览器窗口重新获取焦点时，重新向服务器端发送请求同步最新状态。
        refetchOnWindowFocus: false,
        // 请求是否需要在固定间隔时间内再次发起，默认false
        refetchInterval: false,
        // react-query中Get请求的缓存时间。在这个时间之内，再次执行这个Query请求时，会先直接返回缓存的结果，同时再向服务器发出真实请求（会不会向服务器，取决于下面的staleTime的配置），请求得到的新数据回来后，有更新的话会更新UI上的数据呈现。单位，毫秒。
        cacheTime: +process.env.REACT_APP_CACHE_TIME,
        // 请求结果的保质期。如果请求结果仍然在保质期内，直接从缓存中获取结果，不会在后台发送真实的请求来更新请求结果的缓存。单位，毫秒。
        staleTime: +process.env.REACT_APP_STALE_TIME,
        // 请求失败后重试次数。注意，修改此值时需要考虑重试次数对服务器QPS的影响！
        retry: +process.env.REACT_APP_RETRY_TIMES,
        // 请求失败后过多久再重试。单位，毫秒。
        retryDelay: +process.env.REACT_APP_RETRY_DELAY,
        /**
         * Query results by default are structurally shared to detect if data has actually changed and if not,
         * the data reference remains unchanged to better help with value stabilization with regards to
         * useMemo and useCallback. If this concept sounds foreign, then don't worry about it! 99.9%
         * of the time you will not need to disable this and it makes your app more performant at zero cost to you.
         */
        structuralSharing: true,
        // 统一报错入口
        onError(error) {
          if (error) {
            console.error(error as Error);
          }
          // 可以在这里做错误的统一拦截处理
        },
      },
      // 作用域useMutate（作用域Post、Put、Patch、Delete方法）
      mutations: {
        // 请求失败后重试次数。注意，修改此值时需要考虑重试次数对服务器QPS的影响！
        retry: +process.env.REACT_APP_RETRY_TIMES,
        // 请求失败后过多久再重试。单位，毫秒。
        retryDelay: +process.env.REACT_APP_RETRY_DELAY,
        // 统一报错入口
        onError(error) {
          if (error) {
            console.error(error as Error);
          }
          // 可以在这里做错误的统一拦截处理
        },
      },
    },
  });

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      <Provider store={store}>
        {/* 将 queryClient 对象传递到下层组件 */}
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            {children}
          </BrowserRouter>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
}

export default AppProviders;
