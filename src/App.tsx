import {
  useRoutes,
  Navigate,
} from 'react-router-dom';

import Layout from './Layout.tsx';
import Home from './Home.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';
import PageNotFound from './PageNotFound.tsx';
import './App.less';

function App() {
  const mainRoutes = {
    path: '/',
    element: <Layout/>,
    children: [
      {
        path: "/",
        element: <Home/>
      },
      {
        path: "projects",
        element: <Projects />
      },
      {
        path: "project/:id",
        element: <Project />
      },
      {
        path: "editor",
        element: <Editor />
      },
      {
        path: "404",
        element: <PageNotFound />
      },
      {
        path: '*',
        element: <Navigate to='/404' />
      },
    ],
  };
  const routing = useRoutes([mainRoutes]);

  return (
    <div className="App">
      { routing }
    </div>
  );
}

export default App;
