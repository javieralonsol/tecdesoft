import React, { useState } from 'react';
import { AuthProvider } from './components/providers/AuthProvider.js';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';
import LoginPage from './pages/LoginPage.js';
import InformPage from './pages/InformPage.js';
import Modal from './components/Modal.js';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

function App() {
  const [modalContent, setModalContent] = useState('');

  return (
    <AuthProvider>
      <Router>
        <aside className="bg-image"></aside>
        <Header />
        <main>
          <Switch>
            <Route path="/inform.html">
              <InformPage setModalContent={setModalContent} />
            </Route>
            <LoginPage />
          </Switch>
        </main>
        <Footer />
        <Modal modalContent={modalContent} setModalContent={setModalContent} />
      </Router>
    </AuthProvider>
  );
}

export default App;
