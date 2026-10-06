import { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import Footer from './components/Footer/Footer';
import api from './utils/api';
import CurrentUserContext from './contexts/CurrentUserContext';
import type { UserData } from './interfaces/UserData';
import type { CardData } from './interfaces/CardData';
import type { PopupConfig } from './interfaces/ModalData';
import RemoveCard from './components/Main/Popup/RemoveCard/RemoveCard';
import type { CardFormData } from './interfaces/CardFormData';


function App(): React.JSX.Element {
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [cards, setCards] = useState<CardData[]>([]);
  const [popup, setPopup] = useState<PopupConfig | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [userData, initialCards] = await Promise.all([
          api.getUserInfo(),
          api.getInitialCards(),
        ]);
        setCurrentUser(userData);
        setCards(initialCards);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

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
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
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
      <div className="page__content">
        <Header />
       <Main
  cards={cards}
  popup={popup}
  handleOpenPopup={handleOpenPopup}
  handleClosePopup={handleClosePopup}
/>
        <Footer />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;