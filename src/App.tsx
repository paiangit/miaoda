import { useRoutes, Navigate } from 'react-router-dom';

import { MainLayout, MainPage } from './features/home';
import { AppListPage } from './features/myApps';
import { AdminLayout, ManagementPage } from './features/management';
import { AppSettingsPage } from './features/settings';
import { AppPublishPage } from './features/publish';
import { DesignerPage } from './features/design';
import { PreviewPage } from './features/preview';
import { RegisterPage, LoginPage } from './features/auth';
import { ProfilePage } from './features/user';
import { PageNotFound } from './common/containers';
import { CounterPage } from './features/examples';
// import routeConfig from './common/routeConfig.js';

function App() {
  const mainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: '/',
        element: <MainPage />,
      },
      {
        path: '404',
        element: <PageNotFound />,
      },
      {
        path: 'myApps',
        element: <AppListPage />,
      },
      {
        path: 'app/:appId/admin',
        element: <Navigate to=":pageId" />,
      },
      {
        path: 'app/:appId/design',
        element: <DesignerPage />,
      },
      {
        path: 'app/:appId/preview',
        element: <PreviewPage />,
      },
      {
        path: 'auth/register',
        element: <RegisterPage />,
      },
      {
        path: 'auth/login',
        element: <LoginPage />,
      },
      {
        path: 'user/:userId/profile',
        element: <ProfilePage />,
      },
      {
        path: 'examples/counter',
        element: <CounterPage />,
      },
    ],
  };
  const adminRoutes = {
    path: 'app/:appId/admin/',
    element: <AdminLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: ':pageId',
        element: <ManagementPage />,
      },
      {
        path: 'appPublish',
        element: <AppPublishPage />,
      },
      {
        path: 'appSettings',
        element: <AppSettingsPage />,
      },
    ],
  };
  const routing = useRoutes([mainRoutes, adminRoutes]);
  // const routing = useRoutes([routeConfig]);

  return <div className="app">{routing}</div>;
}

export default App;
