import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/ErrorBoundary';

// Safe root mounting with error boundary wrapping
const mountApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    console.error('Failed to find the root element.');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary name="Root">
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Initial mount error:', error);
    // Fallback UI for catastrophic failure before React can render anything
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #fefce8; font-family: sans-serif; padding: 20px; text-align: center;">
        <div style="background: white; padding: 40px; border-radius: 24px; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1); max-width: 400px;">
          <h1 style="color: #000; font-weight: 900; margin-bottom: 16px; text-transform: uppercase; letter-spacing: -0.05em;">WONGAYE</h1>
          <p style="color: #666; margin-bottom: 24px;">L'application n'a pas pu démarrer. Veuillez actualiser la page.</p>
          <button onclick="window.location.reload()" style="background: #facc15; border: none; padding: 12px 24px; border-radius: 12px; font-weight: 900; cursor: pointer; width: 100%; text-transform: uppercase;">Actualiser</button>
        </div>
      </div>
    `;
  }
};

// Handle unhandled promise rejections and global errors
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled Promise Rejection:', event.reason);
});

window.addEventListener('error', (event) => {
  console.error('Global JS Error:', event.error);
});

mountApp();