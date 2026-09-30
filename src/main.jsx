import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Client data persistence protection active - no destructive purges

// Register Progressive Web App (PWA) Service Worker for offline support and native app installability
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✅ SomaHome PWA ServiceWorker registered with scope:', registration.scope);
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
