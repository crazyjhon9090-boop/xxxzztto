import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { CategoryProvider } from './contexts/CategoryContext';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CategoryProvider>
        <AppRoutes />
      </CategoryProvider>
    </AuthProvider>
  </React.StrictMode>
);
