import React from 'react';
import {
  BrowserRouter,
  Link,
  Routes,
  Route
} from 'react-router-dom';

import App from './App.tsx';
import Projects from './Projects.tsx';
import Project from './Project.tsx';
import Editor from './Editor.tsx';

function Root() {
  return (
    <BrowserRouter>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/projects">Projects</Link></li>
        <li><Link to="/project/1">Project 1</Link></li>
        <li><Link to="/editor">Editor</Link></li>
      </ul>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:id" element={<Project />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Root;
