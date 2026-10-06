import successIcon from '../../images/success-icon.svg';
import errorIcon from '../../images/error-icon.svg';

type InfoTooltipProps = {
  isOpen: boolean;
  isSuccess: boolean;
  message: string;
  onClose: () => void;
};

export default function InfoTooltip(props: InfoTooltipProps): React.JSX.Element {
  const { isOpen, isSuccess, message, onClose } = props;

  return (
    <div className={`infotooltip ${isOpen ? 'infotooltip_is-opened' : ''}`}>
      <div className="infotooltip__content">
        <button
          aria-label="Cerrar"
          className="infotooltip__close"
          type="button"
          onClick={onClose}
        />
        <img
          className="infotooltip__icon"
          src={isSuccess ? successIcon : errorIcon}
          alt={isSuccess ? 'Éxito' : 'Error'}
        />
        <p className="infotooltip__message">{message}</p>
      </div>
    </div>
  );
}
