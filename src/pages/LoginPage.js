import React, { useContext, useState } from 'react';
import { Redirect, useHistory } from 'react-router';

import { AuthContext } from '../components/providers/AuthProvider.js';

export default function Login() {
  const [user, setUser] = useContext(AuthContext);
  const [formValues, setFormValues] = useState({ email: 'josecarlos-perez@tecdesoft.es', password: 'TicoTico22$$' });
  const [passwordReveal, setPasswordReveal] = useState(false);

  const history = useHistory();

  console.log('Pintando Login', user);

  if (user.token) {
    return <Redirect to="/inform.html" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    ///////////////
    // validaciones!!!!
    ///////////////

    const loginFetchResponse = await fetch(
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
    if (loginFetchResponse.status === 200) {
      const loginJson = await loginFetchResponse.json();
      console.log(loginJson.idToken);
      setUser({ token: loginJson.idToken });
      history.push('/inform.html');
    } else {
      console.log('Error de status:', loginFetchResponse.status);
      // mostrar error
      setUser({ token: '' });
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          onChange={(e) => setFormValues({ ...formValues, email: e.target.value })}
          value={formValues.email}
        />
        <input
          autoComplete="current-password"
          name="password"
          onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          spellCheck="false"
          type={passwordReveal ? 'text' : 'password'}
          value={formValues.password}
          required
        />
        <label htmlFor="password">Contraseña</label>
        <span
          className={`password-eye${passwordReveal ? ' eye-yes' : ''}`}
          onClick={() => setPasswordReveal(!passwordReveal)}
        ></span>
        <input type="submit" value="Iniciar sesión" />
        <div>{user.token || 'sin token'}</div>
      </form>
    </div>
  );
}
