import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>  // Consider removing StrictMode during development if it causes double-renders
    <App />
  // </React.StrictMode>
);