import './ChatInput.css';
import { useEffect, useState } from 'react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  useEffect(() => {
    console.log('sending message', message);
  }, [message]);

  const checkContent = () => {
    console.log(`checkContent called : ${message}`);
  };

  return (
    <div className="input-container">
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
        onClick={checkContent}
      >
        보내기
      </button>
    </div>
  );
}
