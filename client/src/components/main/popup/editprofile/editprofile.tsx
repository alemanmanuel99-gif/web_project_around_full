import { useState, useContext } from 'react';
import CurrentUserContext from '../../../../contexts/CurrentUserContext';

export default function EditProfile(): React.JSX.Element {
  const { currentUser, handleUpdateUser } = useContext(CurrentUserContext);

  const [name, setName] = useState(currentUser?.name || '');
  const [description, setDescription] = useState(currentUser?.about || '');
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [nameTouched, setNameTouched] = useState(false);
  const [descriptionTouched, setDescriptionTouched] = useState(false);

  const isFormValid = name.length >= 2 && description.length >= 2 && !nameError && !descriptionError;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameTouched(true);
    if (!e.target.validity.valid) {
      setNameError(e.target.validationMessage);
    } else {
      setNameError('');
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
    setDescriptionTouched(true);
    if (!e.target.validity.valid) {
      setDescriptionError(e.target.validationMessage);
    } else {
      setDescriptionError('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdateUser({ name, about: description });
  };

  return (
    <form className="popup__form" name="edit-profile-form" noValidate onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        className="popup__input popup__input_type_name"
        placeholder="Nombre"
        id="name-input"
        minLength={2}
        maxLength={40}
        required
        value={name}
        onChange={handleNameChange}
      />
      <span className={`name-input-error popup__input-error ${nameTouched && nameError ? 'popup__input-error_active' : ''}`}>
        {nameTouched ? nameError : ''}
      </span>
      <input
        className="popup__input popup__input_type_description"
        name="description"
        placeholder="Acerca de mí"
        type="text"
        id="description-input"
        minLength={2}
        maxLength={200}
        required
        value={description}
        onChange={handleDescriptionChange}
      />
      <span className={`description-input-error popup__input-error ${descriptionTouched && descriptionError ? 'popup__input-error_active' : ''}`}>
        {descriptionTouched ? descriptionError : ''}
      </span>
      <button
        className="button popup__button"
        type="submit"
        disabled={!isFormValid}
      >
        Guardar
      </button>
    </form>
  );
}