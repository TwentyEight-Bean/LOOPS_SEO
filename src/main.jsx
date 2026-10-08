import React from 'react';
import { createRoot } from 'react-dom/client';
import './base.css';
import AppRouter from './AppRouter.jsx';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
}
