import { useEffect, useState } from 'react';
import { useSocketContext } from '../../contexts/SocketContext';
import { validation } from '../../utils/beforeWriting';
import './ChatInput.css';

export default function ChatInput(props) {
  const rid = props.rid;
  const { socket } = useSocketContext();
  const [message, setMessage] = useState('');
  useEffect(() => {
    // console.log(`sending message : ${message}, rid: ${rid}`);
  }, [message]);

  const handleSendMessage = () => {
    console.log(`handleSendMessage called : ${message}, ${rid}`);
    // 유효성 검사 후
    if (validation(message, 'message')) {
      // 소켓 발신
      socket.emit('sendMessage', message, rid, (res) => {
        console.log(`'sendMessage' res : `, res);
      });
    }
    setMessage('');
  };

  return (
    <div className="chatInput-body">
      <input
        className="input-field"
        type="text"
        value={message}
        placeholder="메세지를 입력하세요.."
        onChange={(e) => {
          setMessage(e.target.value);
        }}
        rows={1}
      />
      <button className="send-button" disabled={message === ''} onClick={handleSendMessage}>
        보내기
      </button>
    </div>
  );
}
