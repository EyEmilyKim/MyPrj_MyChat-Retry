import './ChatInput.css';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';
const { validateText, escapeHTML } = require('../utils/beforeWriting');

export default function ChatInput(props) {
  const rid = props.rid;
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  useEffect(() => {
    // console.log(`sending message : ${message}, rid: ${rid}`);
  }, [message]);

  const handleSendMessage = () => {
    console.log(`handleSendMessage called : ${message}, ${rid}`);
    // 메세지 유효성 검사
    const validation = validateText(message);
    // console.log('validation', validation);
    if (!validation.result) {
      console.log(`Invalid message :\n${validation.invalidReason.join('\n')}`);
      alert(`Invalid message :\n${validation.invalidReason.join('\n')}`);
      return;
    }
    // HTML escape 처리
    const escapedMessage = escapeHTML(message);
    // console.log(`modified message : ${escapedMessage}`);
    // 소켓 발신
    socket.emit('sendMessage', escapedMessage, rid, (res) => {
      console.log(`'sendMessage' res : `, res);
    });
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
      <button
        className="send-button"
        disabled={message === ''}
        onClick={handleSendMessage}
      >
        보내기
      </button>
    </div>
  );
}
