import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';

type HeaderProps = {
  loggedIn: boolean;
  userEmail?: string;
  authPage?: 'signin' | 'signup';
  onLogout?: () => void;
};

function Header(props: HeaderProps): React.JSX.Element {
  const { loggedIn, userEmail, authPage, onLogout } = props;

  return (
    <header className="header page__section">
      <img
        alt="Logotipo Around The U.S."
        className="logo header__logo"
        src={logo}
      />
      <div className="header__nav">
        {loggedIn && (
          <>
            <p className="header__email">{userEmail}</p>
            <button className="header__link header__link_type_button" type="button" onClick={onLogout}>
              Cerrar sesión
            </button>
          </>
        )}
        {!loggedIn && authPage === 'signin' && (
          <Link className="header__link" to="/signup">
            Regístrate
          </Link>
        )}
        {!loggedIn && authPage === 'signup' && (
          <Link className="header__link" to="/signin">
            Iniciar sesión
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
