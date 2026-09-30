import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Automatic recovery from stale deployment chunks (Vite Preload Recovery)
window.addEventListener('vite:preloadError', (event) => {
  const lastReload = sessionStorage.getItem('somahome_chunk_reload');
  const now = Date.now();
  if (!lastReload || now - parseInt(lastReload, 10) > 10000) {
    sessionStorage.setItem('somahome_chunk_reload', String(now));
    console.warn('New deployment detected. Reloading to load latest application chunks...');
    event.preventDefault();
    window.location.reload();
  }
});

// Register Progressive Web App (PWA) Service Worker for offline support and native app installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SomaHome PWA ServiceWorker registered with scope:', registration.scope);
        // Check for latest deployment updates immediately
        registration.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('⚠️ ServiceWorker registration error:', err);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
