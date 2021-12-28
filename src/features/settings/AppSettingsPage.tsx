import { useParams } from 'react-router-dom';
import './AppSettingsPage.less';

export default function AppSettingsPage() {
  const params = useParams();

  return (
    <div className="settings-app-settings" >
      App Settings for app {params.appId}
    </div>
  );
}

