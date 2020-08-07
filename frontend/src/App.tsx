import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './routes';

import { AuthProvider } from './hooks/auth';
import GlobalStyle from './styles/global';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes />
      </AuthProvider>
      <GlobalStyle />
    </Router>
  );
};

export default App;
