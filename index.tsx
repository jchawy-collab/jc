
// Standard React entry point to replace the previous Python/Streamlit content
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

/**
 * Main application mounting logic. 
 * Replaces accidental Python script with proper JSX mounting to fix build errors.
 */
const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
