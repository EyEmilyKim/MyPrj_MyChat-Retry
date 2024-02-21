import { useEffect, useState } from 'react';

export default function useGroupingMessages(messageList) {
  const [groupedMessages, setGroupedMessages] = useState({});

  // 메세지 리스트를 날짜별로 그룹화하는 함수
  const groupingMessageList = (messageList) => {
    // console.log('groupingMessageList called', messageList);
    // 그룹화된 메시지를 담을 객체
    const groupedMessages = {};
    // messageList를 순회하면서 날짜 추출, 그룹화
    messageList.forEach((msg) => {
      const dateMatch = msg.timestamp.match(/\d{4}\.\d{2}\.\d{2}\([\w가-힣]+\)/);
      if (dateMatch) {
        const date = dateMatch[0];

        if (groupedMessages[date]) {
          groupedMessages[date].push(msg);
        } else {
          groupedMessages[date] = [msg];
        }
      }
    });
    // console.log('groupedMessageList', groupedMessageList);
    setGroupedMessages(groupedMessages);
  };

  useEffect(() => {
    groupingMessageList(messageList);
  }, [messageList]);

  return { groupedMessages };
}
