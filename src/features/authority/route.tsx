import {
  RegisterPage,
  SignInPage,
} from './index.tsx';

export default {
  path: 'authority',
  children: [
    {
      path: 'register',
      element: <RegisterPage />,
    },
    {
      path: 'signIn',
      element: <SignInPage />,
    },
  ],
}
