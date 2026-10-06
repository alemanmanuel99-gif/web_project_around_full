import { useContext } from 'react';
import CurrentUserContext from '../../contexts/CurrentUserContext';
import Popup from './popup/popup.tsx';
import type { PopupConfig } from '../../interfaces/ModalData';
import type { CardData } from '../../interfaces/CardData';
import NewCard from './popup/newcard/newcard.tsx';
import EditProfile from './popup/editprofile/editprofile.tsx';
import EditAvatar from './popup/editavatar/editavatar.tsx';
import Card from './card/card.tsx';

type MainProps = {
  cards: CardData[];
  popup: PopupConfig | null;
  handleOpenPopup: (popup: PopupConfig) => void;
  handleClosePopup: () => void;
};

function Main(props: MainProps): React.JSX.Element {
  const { cards, popup, handleOpenPopup, handleClosePopup } = props;
  const { currentUser } = useContext(CurrentUserContext);

  const newCardPopup: PopupConfig = {
    title: 'Nuevo lugar',
    children: <NewCard />,
  };

  const editProfilePopup: PopupConfig = {
    title: 'Editar perfil',
    children: <EditProfile />,
  };

  const editAvatarPopup: PopupConfig = {
    title: 'Actualizar foto de perfil',
    children: <EditAvatar />,
  };

  return (
    <main className="content">
      <section className="profile page__section">
        <div className="profile__image-container">
          <img className="profile__image" src={currentUser?.avatar} alt={currentUser?.name} />
          <div
            className="profile__image-overlay"
            onClick={() => handleOpenPopup(editAvatarPopup)}
          >
            <img
              className="profile__image-edit-icon"
              src="./src/images/edit-icon.svg"
              alt="Editar avatar"
            />
          </div>
        </div>
        <div className="profile__info">
          <h1 className="profile__title">{currentUser?.name}</h1>
          <button
            aria-label="Editar perfil"
            className="profile__edit-button"
            type="button"
            onClick={() => handleOpenPopup(editProfilePopup)}
          ></button>
          <p className="profile__description">{currentUser?.about}</p>
        </div>
        <button
          aria-label="Agregar tarjeta"
          className="profile__add-button"
          type="button"
          onClick={() => handleOpenPopup(newCardPopup)}
        ></button>
      </section>
      <section className="cards page__section">
        <ul className="cards__list">
          {cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onCardClick={handleOpenPopup}
            />
          ))}
        </ul>
      </section>
      {popup && (
        <Popup onClose={handleClosePopup} title={popup.title} isOpen={popup !== null}>
          {popup.children}
        </Popup>
      )}
    </main>
  );
}

export default Main;