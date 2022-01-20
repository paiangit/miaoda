import { AppPublishPage } from './index.tsx';

export default {
  path: 'app/:appId/admin',
  children: [
    {
      path: 'appPublish',
      element: <AppPublishPage />,
    }
  ],
}
