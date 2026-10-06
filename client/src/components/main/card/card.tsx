import { useContext } from 'react';
import type { CardData } from '../../../interfaces/CardData';
import type { PopupConfig } from '../../../interfaces/ModalData';
import ImagePopup from '../popup/imagepopup/imagepopup.tsx';
import CurrentUserContext from '../../../contexts/CurrentUserContext';

type CardProps = {
  card: CardData;
  onCardClick: (popup: PopupConfig) => void;
};

export default function Card(props: CardProps): React.JSX.Element {
  const { card, onCardClick } = props;
  const { name, link } = card;
  const { handleCardLike, handleCardDelete } = useContext(CurrentUserContext);

  const imageComponent: PopupConfig = {
    children: <ImagePopup card={card} />,
  };

  const cardLikeButtonClassName = `card__like-button ${
    card.isLiked ? 'card__like-button_is-active' : ''
  }`;

  return (
    <li className="card">
      <img
        className="card__image"
        src={link}
        alt={name}
        onClick={() => onCardClick(imageComponent)}
      />
      <button
        aria-label="Eliminar tarjeta"
        className="card__delete-button"
        type="button"
        onClick={() => handleCardDelete(card)}
      ></button>
      <div className="card__description">
        <h2 className="card__title">{name}</h2>
        <button
          aria-label="Botón Me gusta"
          type="button"
          className={cardLikeButtonClassName}
          onClick={() => handleCardLike(card)}
        ></button>
      </div>
    </li>
  );
}