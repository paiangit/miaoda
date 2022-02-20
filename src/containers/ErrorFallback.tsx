import { Button } from 'antd';
import './ErrorFallback.less';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="common-error-fallback">
      <div className="inner">
        <p className="title">出错了</p>
        <pre className="message">{error.message}</pre>
        <Button className="button" type="primary" onClick={resetErrorBoundary}>
          重试
        </Button>
      </div>
    </div>
  );
}
