import {
  RegisterPage,
  LoginPage,
} from './index.tsx';

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
}
