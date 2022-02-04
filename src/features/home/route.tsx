import { MainLayout, MainPage } from './index';

export default {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: '/',
      element: <MainPage />,
    },
  ],
};
