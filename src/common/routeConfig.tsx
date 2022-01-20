import { MainLayout } from '../features/home';
import { PageNotFound } from '../features/common';
import homeRoute from '../features/home/route';
import commonRoute from '../features/common/route';
import designRoute from '../features/design/route';
import managementRoute from '../features/management/route';
import myAppsRoute from '../features/myApps/route';
import previewRoute from '../features/preview/route';
import publishRoute from '../features/publish/route';
import settingsRoute from '../features/settings/route';
import _ from 'lodash';

interface RouteChild {
  path: '*',
  element: JSX.Element,
  children: RouteChild[]
}

const children = [
  homeRoute,
  commonRoute,
  designRoute,
  managementRoute,
  myAppsRoute,
  previewRoute,
  publishRoute,
  settingsRoute,
];

// 过滤掉那些没有element且没有children的route
const routes = [{
  path: '/',
  element: <MainLayout/>,
  children: [
    ...children,
    {
      path: '*',
      element: <PageNotFound/>,
      children: []
    },
  ].filter(r => (r as RouteChild).element || (r as RouteChild).children && (r as RouteChild).children.length),
}];

// Handle isIndex property of route config:
// Duplicate it and put it as the first route rule.
function handleIndexRoute(route) {
  if (!route.children || !route.children.length) {
    return;
  }

  const indexRoute = _.find(route.children, (child => child.isIndex));
  if (indexRoute) {
    const first = { ...indexRoute };
    first.path = '';
    first.exact = true;
    first.autoIndexRoute = true; // mark it so that the simple nav won't show it.
    route.children.unshift(first);
  }
  route.children.forEach(handleIndexRoute);
}

routes.forEach(handleIndexRoute);

export default routes;
