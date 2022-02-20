import { lazy, Suspense } from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import { FullPageLoading } from './components/FullPageLoading';

const NotFoundPage = lazy(() => import('./features/exception/NotFoundPage'));
const MainLayout = lazy(() => import('./features/home/MainLayout'));
const MainPage = lazy(() => import('./features/home/MainPage'));
const AppListPage = lazy(() => import('./features/myApps/AppListPage'));
const RegisterPage = lazy(() => import('./features/auth/RegisterPage'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const ProfilePage = lazy(() => import('./features/user/ProfilePage'));
const TodosPage = lazy(() => import('./features/examples/TodosPage'));

const AdminLayout = lazy(() => import('./features/management/AdminLayout'));
const ManagementPage = lazy(() => import('./features/management/ManagementPage'));
const AppSettingsPage = lazy(() => import('./features/settings/AppSettingsPage'));
const AppPublishPage = lazy(() => import('./features/publish/AppPublishPage'));

const DesignLayout = lazy(() => import('./features/design/DesignLayout'));
const DesignerPage = lazy(() => import('./features/design/DesignerPage'));

const PreviewLayout = lazy(() => import('./features/preview/PreviewLayout'));
const PreviewPage = lazy(() => import('./features/preview/PreviewPage'));
// import routeConfig from './routeConfig.js';

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
        path: 'app/:appId/admin',
        element: <Navigate to=":pageId" />,
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
        path: 'user/:userId/myApps',
        element: <AppListPage />,
      },
      {
        path: 'user/:userId/profile',
        element: <ProfilePage />,
      },
      {
        path: 'examples/todos',
        element: <TodosPage />,
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
  const designRoutes = {
    path: 'app/:appId/design/',
    element: <DesignLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: ':pageId',
        element: <DesignerPage />,
      },
    ],
  };
  const previewRoutes = {
    path: 'app/:appId/preview/',
    element: <PreviewLayout />,
    children: [
      {
        path: '*',
        element: <Navigate to="/404" />,
      },
      {
        path: ':pageId',
        element: <PreviewPage />,
      },
    ],
  };
  const routing = useRoutes([mainRoutes, adminRoutes, designRoutes, previewRoutes]);
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
