import { useParams } from 'react-router-dom';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import './AppPublishPage.less';

export default function AppPublish() {
  useDocumentTitle('发布应用');

  const params = useParams();

  return (
    <div className="publish-app-publish-page">Publish app {params.appId}</div>
  );
}
