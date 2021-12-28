import { useParams } from 'react-router-dom';
import './AppPublishPage.less';

export default function AppPublish() {
  const params = useParams();

  return (
    <div className="publish-app-publish-page" >
      Publish app {params.appId}
    </div>
  );
}
