import { RegisterPage, LoginPage } from './index';

export default {
  path: 'auth',
  children: [
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
  ],
};
