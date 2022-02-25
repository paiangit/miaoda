import { Button } from 'antd';
import style from './ErrorFallback.module.less';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={ style['common-error-fallback'] }>
      <div className={ style['inner'] }>
        <p className={ style['title'] }>出错了</p>
        <pre className={ style['message'] }>{error.message}</pre>
        <Button className={ style['button'] } type="primary" onClick={resetErrorBoundary}>
          重试
        </Button>
      </div>
    </div>
  );
}
