/**
 * main.jsx — React application entry point
 *
 * Mounts the root App component into #root.
 * CSS is imported inside App.jsx so Vite can bundle it correctly.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
