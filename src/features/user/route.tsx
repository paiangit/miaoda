import { ProfilePage } from './index';

export default {
  path: 'user/:userId',
  children: [
    {
      path: 'profile',
      element: <ProfilePage />,
    },
  ],
};
