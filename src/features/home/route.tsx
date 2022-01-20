import { MainLayout, MainPage } from './index.tsx';

export default {
  path: '/',
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <MainPage />
    },
  ],
}
