import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router';

import { AuthContext } from '../components/providers/AuthProvider.js';

export default function Login() {
  const [user, setUser] = useContext(AuthContext);
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [passwordReveal, setPasswordReveal] = useState(false);
  const [error, setError] = useState('');

  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(event.target.email.value)) {
      setError('El email no es válido');
      return;
    }

    let loginFetchResponse = '';
    try {
      loginFetchResponse = await fetch(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBr1ehjxkXlICK-Zu0Wu_zUg8H68aQAp5k',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
          },
          body: JSON.stringify({
            email: formValues.email,
            password: formValues.password,
            returnSecureToken: true,
          }),
        }
      );
    } catch (error) {
      setError('No se puede conectar');
      return;
    }

    if (loginFetchResponse.status === 200) {
      const loginJson = await loginFetchResponse.json();
      setUser({ token: loginJson.idToken });
      history.push('/inform.html');
    } else {
      setError('Error de login');
      setUser({ token: '' });
    }
  };

  useEffect(() => {
    setTimeout(() => document.querySelector('#email')?.focus(), 1000);
  }, []);

  return (
    <div className="login centered">
      {user.token && <Redirect to="/inform.html" />}
      <form onSubmit={handleSubmit}>
        <div className="title-login">Inicio de sesión</div>
        <input
          autoComplete="email"
          id="email"
          name="email"
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          required
          spellCheck="false"
          type="text"
          value={formValues.email}
        />
        <label htmlFor="email">Email</label>

        <input
          autoComplete="current-password"
          id="password"
          name="password"
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          required
          spellCheck="false"
          type={passwordReveal ? 'text' : 'password'}
          value={formValues.password}
        />
        <label htmlFor="password">Contraseña</label>
        <span
          className={`password-eye${passwordReveal ? ' eye-yes' : ''}`}
          onClick={() => setPasswordReveal(!passwordReveal)}
        ></span>
        <span className="password-eye eye-yes hidden"></span>
        <button className="submit" type="submit">
          Iniciar sesión
        </button>
        <div className="error">{error}</div>
      </form>
    </div>
  );
}
