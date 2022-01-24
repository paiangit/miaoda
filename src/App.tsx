import {
  useRoutes,
  Navigate,
} from 'react-router-dom';

import {
  MainLayout,
  MainPage,
} from './features/home/index.tsx';
import { AppListPage } from './features/myApps/index.tsx';
import {
  AdminLayout,
  ManagementPage,
} from './features/management/index.tsx';
import { AppSettingsPage } from './features/settings/index.tsx';
import { AppPublishPage } from './features/publish/index.tsx';
import { DesignerPage } from './features/design/index.tsx';
import { PreviewPage } from './features/preview/index.tsx';
import {
  RegisterPage,
  LoginPage,
} from './features/auth/index.tsx';
import { ProfilePage } from './features/user/index.tsx';
import { PageNotFound } from './features/common/index.tsx';
import { CounterPage } from './features/examples/index.tsx';
// import routeConfig from './common/routeConfig.js';

function App() {
  const mainRoutes = {
    path: '/',
    element: <MainLayout/>,
    children: [
      {
        path: '*',
        element: <Navigate to='/404' />
      },
      {
        path: "/",
        element: <MainPage/>
      },
      {
        path: '404',
        element: <PageNotFound />
      },
      {
        path: 'myApps',
        element: <AppListPage />
      },
      {
        path: 'app/:appId/admin',
        element: <Navigate to=':pageId' />
      },
      {
        path: 'app/:appId/design',
        element: <DesignerPage />
      },
      {
        path: 'app/:appId/preview',
        element: <PreviewPage />
      },
      {
        path: 'auth/register',
        element: <RegisterPage />
      },
      {
        path: 'auth/login',
        element: <LoginPage />
      },
      {
        path: 'user/:userId/profile',
        element: <ProfilePage />
      },
      {
        path: 'examples/counter',
        element: <CounterPage />
      },
    ],
  };
  const adminRoutes = {
    path: 'app/:appId/admin/',
    element: <AdminLayout/>,
    children: [
      {
        path: '*',
        element: <Navigate to='/404'/>
      },
      {
        path: ':pageId',
        element: <ManagementPage />
      },
      {
        path: 'appPublish',
        element: <AppPublishPage />
      },
      {
        path: 'appSettings',
        element: <AppSettingsPage />
      },
    ]
  };
  const routing = useRoutes([mainRoutes, adminRoutes]);
  // const routing = useRoutes([routeConfig]);

  return (
    <div className="app">
      { routing }
    </div>
  );
}

export default App;
