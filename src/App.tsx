import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { FullPageLoading } from './common/components/FullPageLoading';

const NotFoundPage = lazy(() => import('./features/exception/NotFoundPage'));
const MainLayout = lazy(() => import('./features/home/MainLayout'));
const MainPage = lazy(() => import('./features/home/MainPage'));
const AppListPage = lazy(() => import('./features/myApps/AppListPage'));
const AdminLayout = lazy(() => import('./features/management/AdminLayout'));
const ManagementPage = lazy(
  () => import('./features/management/ManagementPage')
);
const AppSettingsPage = lazy(
  () => import('./features/settings/AppSettingsPage')
);
const AppPublishPage = lazy(() => import('./features/publish/AppPublishPage'));
const DesignerPage = lazy(() => import('./features/design/DesignerPage'));
const PreviewPage = lazy(() => import('./features/preview/PreviewPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const ProfilePage = lazy(() => import('./features/user/ProfilePage'));
const CounterPage = lazy(() => import('./features/examples/CounterPage'));
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
        element: <NotFoundPage />,
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

  return (
    <div className="app">
      <Suspense fallback={<FullPageLoading></FullPageLoading>}>
        {routing}
      </Suspense>
    </div>
  );
}

export default App;
