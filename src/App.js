import './App.css';
import { AuthProvider } from './components/providers/AuthProvider.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import LoginPage from './pages/LoginPage.js';

function App() {
  return (
    <AuthProvider>
      <Router>
        <header>
          <h1>Tecdesoft</h1>
        </header>
        <main>
          <Switch>
            <Route path="/inform">
              <h1>Inform</h1>
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
