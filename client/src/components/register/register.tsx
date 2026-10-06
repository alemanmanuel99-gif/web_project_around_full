import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../header/header';

type RegisterProps = {
  onRegister: (email: string, password: string) => void;
};

export default function Register(props: RegisterProps): React.JSX.Element {
  const { onRegister } = props;
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const isFormValid = email.length > 0 && password.length > 0;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onRegister(email, password);
  };

  return (
    <div className="auth">
      <Header loggedIn={false} authPage="signup" />
      <form className="auth__form" name="register-form" onSubmit={handleSubmit}>
        <h2 className="auth__title">Regístrate</h2>
        <input
          type="email"
          name="email"
          className="auth__input"
          placeholder="Correo electrónico"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          className="auth__input"
          placeholder="Contraseña"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="auth__button" type="submit" disabled={!isFormValid}>
          Regístrate
        </button>
        <p className="auth__switch">
          ¿Ya eres miembro?{' '}
          <Link className="auth__switch-link" to="/signin">
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
