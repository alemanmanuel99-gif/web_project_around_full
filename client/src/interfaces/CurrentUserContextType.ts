import type { UserData } from './UserData';
import type { CardData } from './CardData';

export interface CurrentUserContextType {
  currentUser: UserData | null;
  handleUpdateUser: (data: { name: string; about: string }) => void;
  handleUpdateAvatar: (data: { avatar: string }) => void;
  handleAddPlaceSubmit: (data: { name: string; link: string }) => void;
  handleCardLike: (card: CardData) => void;
  handleCardDelete: (card: CardData) => void;
}