import {
  useParams,
} from 'react-router-dom';
import './ManagementPage.less';

export default function ManagementPage() {
  const params = useParams();

  return (
    <div className="management-management-page" >
      Page management for app {params.appId} page {params.pageId}
    </div>
  );
}
