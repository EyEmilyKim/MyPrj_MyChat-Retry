import './MessageContainer.css';

export default function MessageContainer({ messageList, user }) {
  return (
    <>
      <div>
        {messageList.map((message, index) => {
          return (
            <div key={message._id} className="each-message">
              {message.user.name === 'system' ? (
                <div className="system-message-container">
                  <p className="system-message">{message.content}</p>
                </div>
              ) : message.user.name === user.name ? (
                <div className="my-message-container">
                  <p className="message mine">{message.content}</p>
                </div>
              ) : (
                <div className="others-message-container">
                  <p className="message others">{message.content}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
