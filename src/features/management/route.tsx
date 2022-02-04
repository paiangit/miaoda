import { AdminLayout, ManagementPage } from './index';

export default {
  path: 'app/:appId/admin',
  element: <AdminLayout />,
  children: [
    {
      path: ':pageId',
      element: <ManagementPage />,
    },
  ],
};
