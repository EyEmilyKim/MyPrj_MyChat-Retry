import { useLoginContext } from '../../contexts/LoginContext';
import useIndexOfLastMessage from '../../hooks/useIndexOfLastMessage';
import useStateLogger from '../../hooks/useStateLogger';
import './MessageContainer.css';

export default function MessageContainer(props) {
  const groupedMessages = props.groupedMessages;
  const previousLastRead = props.previousLastRead;
  const prevLastReadRef = props.prevLastReadRef;
  const { user } = useLoginContext();
  const systemId = process.env.REACT_APP_DB_SYSTEM_USER_ID;

  const { indexOfLastMessage } = useIndexOfLastMessage(groupedMessages, previousLastRead);
  // useStateLogger(previousLastRead, 'previousLastRead');
  // useStateLogger(indexOfLastMessage, 'indexOfLastMessage');

  return (
    <>
      {/* 날짜 순회 */}
      {Object.keys(groupedMessages).map((date, index) => (
        <div key={index}>
          <div className="date-divider">{date}</div>
          {/* Array 순회 */}
          {groupedMessages[date].map((message, index) => (
            <div key={'map_' + index}>
              <div key={message.index} className="each-message">
                {message.sender._id === systemId ? (
                  <div className="system-message-container">
                    <p className="system-message">{message.content}</p>
                  </div>
                ) : message.sender.email === user.email ? (
                  <>
                    <div className="message-container mine">
                      <p className="message mine">{message.content}</p>
                    </div>
                    <p className="timestamp mine">
                      {message.timestamp.substring(14, 16) + ' ' + message.timestamp.substring(16)}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="name">{message.sender.name}</p>
                    <div className="message-container others">
                      <p className="message others">{message.content}</p>
                    </div>
                    <p className="timestamp others">{message.timestamp}</p>
                  </>
                )}
              </div>

              {previousLastRead !== indexOfLastMessage && previousLastRead == message.index && (
                <div className="system-message-container" key={'previousLastRead'}>
                  <p className="system-message" ref={prevLastReadRef}>
                    여기까지 읽었습니다
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
