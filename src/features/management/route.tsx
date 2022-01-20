import { AdminLayout, ManagementPage } from './index.tsx';

export default {
  path: 'app/:appId/admin',
  element: <AdminLayout/>,
  children: [
    {
      path: ':pageId',
      element: <ManagementPage />
    },
  ],
}
