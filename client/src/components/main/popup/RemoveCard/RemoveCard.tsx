type ConfirmDeleteProps = {
  onConfirm: () => void;
};

export default function RemoveCard({ onConfirm }: ConfirmDeleteProps): React.JSX.Element {
  return (
    <div className="popup__confirm">
      <button className="popup__button" type="button" onClick={onConfirm}>
        Sí
      </button>
    </div>
  );
}