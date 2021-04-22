import React from 'react';
import { AuthProvider } from './components/providers/AuthProvider.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/LoginPage.js';
import InformPage from './pages/InformPage.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <header>
          <h1>Tecdesoft</h1>
        </header>
        <main>
          <Switch>
            <Route path="/inform.html">
              <InformPage />
            </Route>
            <LoginPage />
          </Switch>
        </main>
        <footer>@ 2021</footer>
      </Router>
    </AuthProvider>
  );
}

export default App;
