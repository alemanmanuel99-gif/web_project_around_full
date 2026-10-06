import { useRef, useState, useContext } from 'react';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';

export default function EditAvatar(): React.JSX.Element {
  const { handleUpdateAvatar } = useContext(CurrentUserContext);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState('');
  const [avatarTouched, setAvatarTouched] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarTouched(true);
    if (!e.target.validity.valid) {
      setAvatarError(e.target.validationMessage);
    } else {
      setAvatarError('');
    }
  };

  const isFormValid = avatarTouched && !avatarError && avatarRef.current?.value !== '';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (avatarRef.current) {
      handleUpdateAvatar({ avatar: avatarRef.current.value });
    }
  };

  return (
    <form className="popup__form" name="edit-avatar-form" noValidate onSubmit={handleSubmit}>
      <input
        className="popup__input"
        type="url"
        name="avatar"
        id="avatar-link"
        placeholder="Enlace a la imagen"
        required
        ref={avatarRef}
        onChange={handleAvatarChange}
      />
      <span className={`popup__input-error avatar-link-error ${avatarTouched && avatarError ? 'popup__input-error_active' : ''}`}>
        {avatarTouched ? avatarError : ''}
      </span>
      <button
        className="popup__button"
        type="submit"
        disabled={!isFormValid}
      >
        Guardar
      </button>
    </form>
  );
}