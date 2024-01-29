import './MessageContainer.css';

export default function MessageContainer({ messageList, user }) {
  const timestampToKST = (timestamp) => {
    const date = new Date(timestamp);
    const KST = new Date(date).toLocaleString('en-US', {
      timeZone: 'Asia/Seoul',
    });
    // console.log(`timestamp > ${timestamp}\nKST > ${KST}\n`);
    return KST;
  };

  return (
    <>
      <div>
        {messageList.map((message, index) => {
          return (
            <div key={message._id} className="each-message">
              {message.sender.name === 'system' ? (
                <div className="system-message-container">
                  <p className="system-message">{message.content}</p>
                </div>
              ) : message.sender.email === user.email ? (
                <>
                  <div className="message-container mine">
                    <p className="message mine">{message.content}</p>
                  </div>
                  <p className="timestamp mine">
                    {timestampToKST(message.timestamp)}
                  </p>
                </>
              ) : (
                <>
                  <p className="name">{message.sender.name}</p>
                  <div className="message-container others">
                    <p className="message others">{message.content}</p>
                  </div>
                  <p className="timestamp others">
                    {timestampToKST(message.timestamp)}
                  </p>
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
