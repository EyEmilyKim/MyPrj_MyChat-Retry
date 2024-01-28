import './ChatInput.css';
import { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../contexts/SocketContext';

export default function ChatInput(props) {
  const rid = props.rid;
  const { socket } = useContext(SocketContext);
  const [message, setMessage] = useState('');
  useEffect(() => {
    console.log(`sending message : ${message}, rid: ${rid}`);
  }, [message]);

  const handleSendMessage = () => {
    console.log(`handleSendMessage called : ${message}, ${rid}`);
    // 메세지 유효성 검사
    const validation = validateMessage(message);
    // console.log('validation', validation);
    if (!validation.result) {
      console.log(`Invalid message :\n${validation.invalidReason.join('\n')}`);
      return;
    }
    // HTML escape 처리
    const escapedMessage = escapeHTML(message);
    console.log(`modified message : ${escapedMessage}`);
    // 소켓 발신
    socket.emit('sendMessage', escapedMessage, rid, (res) => {
      console.log(`'sendMessage' res : ${JSON.stringify(res)}`);
    });
  };

  const validateMessage = (msg) => {
    let isValid = false; // 최종 유효성 변수
    const invalidReason = []; // 미통과 사유 배열
    // 빈 메세지 여부 검사
    let hasContent = false;
    if (msg.trim() === '') {
      invalidReason.push('메세지 내용이 없습니다');
    } else {
      hasContent = true;
    }
    // 기타 유효성 검사..
    // 최종 결과 반환
    if (hasContent && 1 == 1) isValid = true;
    return { result: isValid, invalidReason: invalidReason };
  };

  const escapeHTML = (msg) => {
    return msg.replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
      }[match];
    });
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
        onClick={handleSendMessage}
      >
        보내기
      </button>
    </div>
  );
}
