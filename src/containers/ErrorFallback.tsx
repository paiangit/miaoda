import { Button } from 'antd';
import styles from './ErrorFallback.module.less';

export function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className={ styles['common-error-fallback'] }>
      <div className={ styles['inner'] }>
        <p className={ styles['title'] }>出错了</p>
        <pre className={ styles['message'] }>{error.message}</pre>
        <Button className={ styles['button'] } type="primary" onClick={resetErrorBoundary}>
          重试
        </Button>
      </div>
    </div>
  );
}
