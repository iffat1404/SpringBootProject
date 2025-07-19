import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// Import your AuthProvider here!
import { AuthProvider } from './context/AuthContext';

// Import Radix UI styles
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Theme className="light-theme">
          <App />
        </Theme>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
