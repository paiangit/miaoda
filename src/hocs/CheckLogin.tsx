import { useEffect } from 'react';
import { FullPageLoading } from '../components/FullPageLoading';
import { FullPageRetry } from '../components/FullPageRetry';
import useCheckLogin from './hooks/useCheckLogin';

// 登录高阶组件
export default function CheckLogin(Component) {
  const { mutate: checkLogin, isLoading, isError } = useCheckLogin();

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  return function () {
    if (isLoading) {
      return (<FullPageLoading></FullPageLoading>);
    }

    if (isError) {
      return (<FullPageRetry></FullPageRetry>);
    }

    return <Component />;
  };
}
