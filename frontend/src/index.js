import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './i18n'; // <-- keep this
import { ThemeProvider } from './context/ThemeContext'; // ✅ import ThemeProvider

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ThemeProvider> {/* ✅ wrap App in ThemeProvider */}
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
