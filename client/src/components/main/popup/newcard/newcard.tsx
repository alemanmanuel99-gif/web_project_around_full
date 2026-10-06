import { useState, useContext } from 'react';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';

export default function NewCard(): React.JSX.Element {
  const { handleAddPlaceSubmit } = useContext(CurrentUserContext);

  const [name, setName] = useState('');
  const [link, setLink] = useState('');
  const [nameError, setNameError] = useState('');
  const [linkError, setLinkError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [linkTouched, setLinkTouched] = useState(false);

  const isFormValid = name.length >= 2 && link !== '' && !nameError && !linkError;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameTouched(true);
    if (!e.target.validity.valid) {
      setNameError(e.target.validationMessage);
    } else {
      setNameError('');
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
    setLinkTouched(true);
    if (!e.target.validity.valid) {
      setLinkError(e.target.validationMessage);
    } else {
      setLinkError('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleAddPlaceSubmit({ name, link });
  };

  return (
    <form className="popup__form" id="new-card-form" name="new-card-form" noValidate onSubmit={handleSubmit}>
      <label className="popup__field">
        <input
          id="card-name"
          className="popup__input popup__input_type_card-name"
          name="name"
          placeholder="Título"
          minLength={2}
          maxLength={30}
          required
          type="text"
          value={name}
          onChange={handleNameChange}
        />
        <span className={`popup__input-error ${nameTouched && nameError ? 'popup__input-error_active' : ''}`} id="card-name-error">
          {nameTouched ? nameError : ''}
        </span>
      </label>
      <label className="popup__field">
        <input
          id="card-url"
          className="popup__input popup__input_type_url"
          name="link"
          placeholder="Enlace de la imagen"
          required
          type="url"
          value={link}
          onChange={handleLinkChange}
        />
        <span className={`popup__input-error ${linkTouched && linkError ? 'popup__input-error_active' : ''}`} id="card-url-error">
          {linkTouched ? linkError : ''}
        </span>
      </label>
      <button
        className="button popup__button"
        type="submit"
        disabled={!isFormValid}
      >
        Crear
      </button>
    </form>
  );
}