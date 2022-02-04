import { AppPublishPage } from './index';

export default {
  path: 'app/:appId/admin',
  children: [
    {
      path: 'appPublish',
      element: <AppPublishPage />,
    },
  ],
};
