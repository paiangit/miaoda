import { AppSettingsPage } from './index.ts';

export default {
  path: 'app/:appId/admin',
  children: [
    {
      path: 'appSettings',
      element: <AppSettingsPage />,
    }
  ],
}
