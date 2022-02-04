import { AppSettingsPage } from './index';

export default {
  path: 'app/:appId/admin',
  children: [
    {
      path: 'appSettings',
      element: <AppSettingsPage />,
    },
  ],
};
