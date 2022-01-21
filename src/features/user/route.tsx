import {
  ProfilePage,
} from './index.tsx';

export default {
  path: 'user/:userId',
  children: [
    {
      path: 'profile',
      element: <ProfilePage />,
    },
  ],
}
