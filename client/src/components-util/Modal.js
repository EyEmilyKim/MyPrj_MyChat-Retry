import './Modal.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function Modal({ isModalOpen, toggleModal, children }) {
  if (!isModalOpen) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={toggleModal}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <FontAwesomeIcon icon={faXmark} className="modal-icon-close" onClick={toggleModal} />

        <div className="modal-container">{children}</div>
      </div>
    </div>
  );
}
