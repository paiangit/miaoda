import { useParams } from 'react-router-dom';
import useDocumentTitle from '~hooks/useDocumentTitle';
import './ManagementPage.less';

export default function ManagementPage() {
  useDocumentTitle('应用管理');

  const params = useParams();

  return (
    <div className="management-management-page">
      Page management for app {params.appId} page {params.pageId}
    </div>
  );
}
