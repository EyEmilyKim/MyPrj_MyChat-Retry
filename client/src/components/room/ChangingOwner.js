import { useEffect } from 'react';
import { useLoginContext } from '../../contexts/LoginContext';
import { useSocketContext } from '../../contexts/SocketContext';
import useToggleState from '../../hooks/useToggleState';
import useSelect from '../../hooks/useSelect';
import useStateLogger from '../../hooks/useStateLogger';
import './ChangingOwner.css';
// some CSS definition is in './RoomMenu.css';
import Modal from '../../components-util/Modal';

export default function ChangingOwner({ rid, members }) {
  const { user } = useLoginContext();
  const { socket } = useSocketContext();
  const [isModalOpen, toggleModal] = useToggleState(false);
  const [handleSelectChange, selectedValue, setSelectedValue] = useSelect(-1);
  // useStateLogger(selectedValue, 'newOwnerId');

  useEffect(() => {
    if (!isModalOpen) setSelectedValue('');
  }, [isModalOpen]);

  const handleChangeOwner = () => {
    // console.log(`handleChangeOwner called :\n${rid}, ${selectedValue}`);
    // 소켓 발신
    socket.emit('changeOwner', rid, selectedValue, (res) => {
      console.log(`'changeOwner' res : `, res);
      toggleModal();
    });
  };

  const ModalContent = () => {
    return (
      <div className="changeOwner-body">
        <p className="changeOwner-label">새로운 오너 : </p>

        <select
          className="changeOwner-selectBox"
          value={selectedValue}
          onChange={handleSelectChange}
        >
          <option value=""> --------- </option>
          {members
            .filter((item) => {
              return item.name !== user.name;
            })
            .map((item) => (
              <option value={item._id} key={item._id}>
                {item.name}
              </option>
            ))}
        </select>

        {selectedValue && (
          <button className="changeOwner-button" onClick={handleChangeOwner}>
            변경하기
          </button>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="each-item" key="delegatingOwner">
        <div className="roomMenu-info label click" onClick={toggleModal}>
          오너 변경
        </div>
      </div>

      <Modal isModalOpen={isModalOpen} toggleModal={toggleModal}>
        <ModalContent />
      </Modal>
    </>
  );
}
