import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/styles.css'; // Import the global CSS

// Create the root element and render the App component inside it
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
