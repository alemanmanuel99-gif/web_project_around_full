import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/header/header';
import Main from './components/main/main';
import Footer from './components/footer/footer';
import Login from './components/login/login';
import Register from './components/register/register';
import ProtectedRoute from './components/protectedroute/protectedroute';
import InfoTooltip from './components/infotooltip/infotooltip';
import api from './utils/api';
import { registerUser, loginUser } from './utils/auth';
import CurrentUserContext from './contexts/CurrentUserContext';
import type { UserData } from './interfaces/UserData';
import type { CardData } from './interfaces/CardData';
import type { PopupConfig } from './interfaces/ModalData';
import RemoveCard from './components/main/popup/RemoveCard/RemoveCard';
import type { CardFormData } from './interfaces/CardFormData';

type TooltipState = {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
};

function App(): React.JSX.Element {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [popup, setPopup] = useState<PopupConfig | null>(null);

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [tooltip, setTooltip] = useState<TooltipState>({
    isOpen: false,
    isSuccess: false,
    message: '',
  });

  // Al cargar la página: GET /users/me valida el token y, de paso, trae el perfil completo
  useEffect(() => {
    (async () => {
      const token = localStorage.getItem('jwt');
      if (!token) {
        setIsCheckingToken(false);
        return;
      }
      try {
        const userData = await api.getUserInfo();
        setCurrentUser(userData);
        setLoggedIn(true);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('jwt');
      } finally {
        setIsCheckingToken(false);
      }
    })();
  }, []);

  // Las tarjetas se piden solo con sesión iniciada: la API ya no responde sin token
  useEffect(() => {
    if (!loggedIn) return;
    (async () => {
      try {
        const initialCards = await api.getInitialCards();
        setCards(initialCards);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [loggedIn]);

  function showTooltip(isSuccess: boolean, message: string): void {
    setTooltip({ isOpen: true, isSuccess, message });
  }

  function handleCloseTooltip(): void {
    setTooltip((state) => ({ ...state, isOpen: false }));
  }

  const handleRegister = async (email: string, password: string) => {
    try {
      await registerUser(email, password);
      showTooltip(true, '¡Correcto! Ya estás registrado.');
      navigate('/signin');
    } catch (error) {
      console.error(error);
      showTooltip(false, 'Uy, algo salió mal. Por favor, inténtalo de nuevo.');
    }
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const { token, user } = await loginUser(email, password);
      localStorage.setItem('jwt', token);
      setCurrentUser(user);
      setLoggedIn(true);
      navigate('/');
    } catch (error) {
      console.error(error);
      showTooltip(false, 'Uy, algo salió mal. Por favor, inténtalo de nuevo.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setLoggedIn(false);
    setCurrentUser(null);
    setCards([]);
    navigate('/signin');
  };

  function handleOpenPopup(popup: PopupConfig): void {
    setPopup(popup);
  }

  function handleClosePopup(): void {
    setPopup(null);
  }

  const handleCardLike = async (card: CardData) => {
    const isLiked = card.isLiked;
    try {
      const apiCall = isLiked ? api.removeLike(card._id) : api.addLike(card._id);
      const newCard = await apiCall;
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardDelete = (card: CardData) => {
    const confirmPopup: PopupConfig = {
      title: '¿Estás seguro/a?',
      children: (
        <RemoveCard
          onConfirm={async () => {
            try {
              await api.deleteCard(card._id);
              setCards((state) => state.filter((c) => c._id !== card._id));
              setPopup(null);
            } catch (error) {
              console.error(error);
            }
          }}
        />
      ),
    };
    setPopup(confirmPopup);
  };

  const handleUpdateUser = async (data: { name: string; about: string }) => {
    try {
      const updatedUser = await api.updateUserInfo(data);
      setCurrentUser(updatedUser);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateAvatar = async (data: { avatar: string }) => {
    try {
      const updatedUser = await api.updateAvatar(data);
      setCurrentUser(updatedUser);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddPlaceSubmit = async (data: CardFormData) => {
    try {
      const newCard = await api.addCard(data);
      setCards((state) => [newCard, ...state]);
      setPopup(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
        handleCardLike,
        handleCardDelete,
      }}
    >
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn} isCheckingToken={isCheckingToken}>
              <div className="page__content">
                <Header loggedIn={loggedIn} userEmail={currentUser?.email ?? ''} onLogout={handleLogout} />
                <Main
                  cards={cards}
                  popup={popup}
                  handleOpenPopup={handleOpenPopup}
                  handleClosePopup={handleClosePopup}
                />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/signup"
          element={loggedIn ? <Navigate to="/" replace /> : <Register onRegister={handleRegister} />}
        />
        <Route
          path="/signin"
          element={loggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route path="*" element={<Navigate to={loggedIn ? '/' : '/signin'} replace />} />
      </Routes>
      <InfoTooltip
        isOpen={tooltip.isOpen}
        isSuccess={tooltip.isSuccess}
        message={tooltip.message}
        onClose={handleCloseTooltip}
      />
    </CurrentUserContext.Provider>
  );
}

export default App;
