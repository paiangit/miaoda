import { useEffect } from 'react';
import { FullPageLoading } from '../components/FullPageLoading';
import { FullPageRetry } from '../components/FullPageRetry';
import { useCheckLogin } from './hooks';

// 登录高阶组件
export function CheckLogin(Component) {
  const { mutate: checkLogin, isLoading, isError } = useCheckLogin();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return function () {
    console.log(isLoading);

    if (isLoading) {
      return (<FullPageLoading></FullPageLoading>);
    }

    if (true) {
      return (<FullPageRetry></FullPageRetry>);
    }

    return <Component />;
  };
}
