import { useParams } from 'react-router-dom';
import useDocumentTitle from '~hooks/useDocumentTitle';
import styles from './ManagementPage.module.less';

export default function ManagementPage() {
  useDocumentTitle('应用管理');

  const params = useParams();

  return (
    <div className={ styles['management-management-page'] }>
      Page management for app {params.appId} page {params.pageId}
    </div>
  );
}
