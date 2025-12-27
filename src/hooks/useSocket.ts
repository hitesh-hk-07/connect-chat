import { useState, useEffect, useCallback, useMemo } from "react";
import { MessageStatusType } from "@/components/chat/MessageStatus";
import { FileAttachment } from "@/components/chat/FilePreview";

interface Message {
  id: string;
  content: string;
  sender: string;
  senderId: string;
  roomId: string;
  timestamp: Date;
  status: MessageStatusType;
  attachments?: FileAttachment[];
}

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface TypingUser {
  id: string;
  username: string;
  roomId: string;
}

interface DirectMessage {
  odivtherId: string;
  odivtherName: string;
  unread: number;
}

interface SearchResult {
  id: string;
  content: string;
  sender: string;
  roomId: string;
  roomName: string;
  timestamp: Date;
  isDm: boolean;
}

const rooms = [
  { id: "general", name: "General" },
  { id: "random", name: "Random" },
  { id: "tech", name: "Tech Talk" },
  { id: "gaming", name: "Gaming" },
];

export const useSocket = (userId: string, username: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([
    { id: "1", username: "Alex", isOnline: true },
    { id: "2", username: "Jordan", isOnline: true },
    { id: "3", username: "Sam", isOnline: false },
    { id: "4", username: "Taylor", isOnline: true },
  ]);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [currentRoom, setCurrentRoom] = useState("general");
  const [isConnected, setIsConnected] = useState(true);
  const [directMessages, setDirectMessages] = useState<DirectMessage[]>([]);

  const getDmRoomId = (id1: string, id2: string) => {
    return `dm_${[id1, id2].sort().join("_")}`;
  };

  const [roomMessages, setRoomMessages] = useState<Record<string, Message[]>>({
    general: [
      { id: "1", content: "Welcome to the general chat! 👋", sender: "Alex", senderId: "1", roomId: "general", timestamp: new Date(Date.now() - 3600000), status: "read" },
      { id: "2", content: "Hey everyone! How's it going?", sender: "Jordan", senderId: "2", roomId: "general", timestamp: new Date(Date.now() - 1800000), status: "read" },
    ],
    random: [
      { id: "3", content: "Random thoughts here 🎲", sender: "Sam", senderId: "3", roomId: "random", timestamp: new Date(Date.now() - 7200000), status: "read" },
    ],
    tech: [
      { id: "4", content: "Anyone working on cool projects?", sender: "Taylor", senderId: "4", roomId: "tech", timestamp: new Date(Date.now() - 5400000), status: "read" },
    ],
  });

  useEffect(() => {
    setMessages(roomMessages[currentRoom] || []);
  }, [currentRoom, roomMessages]);

  // Get all messages for search
  const allSearchableMessages = useMemo((): SearchResult[] => {
    const results: SearchResult[] = [];
    
    Object.entries(roomMessages).forEach(([roomId, msgs]) => {
      const isDm = roomId.startsWith("dm_");
      let roomName = roomId;
      
      if (isDm) {
        const otherUserId = roomId.replace("dm_", "").split("_").find(id => id !== userId);
        const otherUser = users.find(u => u.id === otherUserId);
        roomName = otherUser?.username || "Direct Message";
      } else {
        roomName = rooms.find(r => r.id === roomId)?.name || roomId;
      }

      msgs.forEach(msg => {
        if (msg.senderId !== "system") {
          results.push({
            id: msg.id,
            content: msg.content,
            sender: msg.sender,
            roomId: msg.roomId,
            roomName,
            timestamp: msg.timestamp,
            isDm,
          });
        }
      });
    });

    return results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [roomMessages, userId, users]);

  const updateMessageStatus = useCallback((messageId: string, status: MessageStatusType) => {
    setRoomMessages(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(room => {
        updated[room] = updated[room].map(msg =>
          msg.id === messageId ? { ...msg, status } : msg
        );
      });
      return updated;
    });
    setMessages(prev => prev.map(msg =>
      msg.id === messageId ? { ...msg, status } : msg
    ));
  }, []);

  const sendMessage = useCallback((content: string, attachments?: FileAttachment[]) => {
    const messageId = crypto.randomUUID();
    
    const newMessage: Message = {
      id: messageId,
      content,
      sender: username,
      senderId: userId,
      roomId: currentRoom,
      timestamp: new Date(),
      status: "sending",
      attachments,
    };
    
    setRoomMessages(prev => ({
      ...prev,
      [currentRoom]: [...(prev[currentRoom] || []), newMessage]
    }));
    setMessages((prev) => [...prev, newMessage]);

    // Simulate status progression
    setTimeout(() => updateMessageStatus(messageId, "sent"), 300);
    setTimeout(() => updateMessageStatus(messageId, "delivered"), 800);

    // Simulate reply and read receipt
    if (!currentRoom.startsWith("dm_")) {
      setTimeout(() => {
        updateMessageStatus(messageId, "read");
        const replies = ["That's cool!", "Interesting 🤔", "Nice! 👍", "Tell me more!"];
        const randomUser = users.filter(u => u.id !== userId && u.isOnline)[0];
        if (randomUser) {
          const replyMessage: Message = {
            id: crypto.randomUUID(),
            content: replies[Math.floor(Math.random() * replies.length)],
            sender: randomUser.username,
            senderId: randomUser.id,
            roomId: currentRoom,
            timestamp: new Date(),
            status: "read",
          };
          setRoomMessages(prev => ({
            ...prev,
            [currentRoom]: [...(prev[currentRoom] || []), replyMessage]
          }));
          setMessages((prev) => [...prev, replyMessage]);
        }
      }, 1500 + Math.random() * 2000);
    } else {
      const otherUserId = currentRoom.replace("dm_", "").split("_").find(id => id !== userId);
      const otherUser = users.find(u => u.id === otherUserId);
      if (otherUser?.isOnline) {
        setTimeout(() => {
          updateMessageStatus(messageId, "read");
          const dmReplies = ["Hey! 👋", "Got it!", "Thanks for the message!", "Let's chat more!"];
          const replyMessage: Message = {
            id: crypto.randomUUID(),
            content: dmReplies[Math.floor(Math.random() * dmReplies.length)],
            sender: otherUser.username,
            senderId: otherUser.id,
            roomId: currentRoom,
            timestamp: new Date(),
            status: "read",
          };
          setRoomMessages(prev => ({
            ...prev,
            [currentRoom]: [...(prev[currentRoom] || []), replyMessage]
          }));
          setMessages((prev) => [...prev, replyMessage]);
        }, 2000 + Math.random() * 3000);
      }
    }
  }, [userId, username, currentRoom, users, updateMessageStatus]);

  const joinRoom = useCallback((roomId: string) => {
    setCurrentRoom(roomId);
  }, []);

  const startDirectMessage = useCallback((targetUserId: string, targetUsername: string) => {
    const dmRoomId = getDmRoomId(userId, targetUserId);
    
    setDirectMessages(prev => {
      if (!prev.find(dm => dm.odivtherId === targetUserId)) {
        return [...prev, { odivtherId: targetUserId, odivtherName: targetUsername, unread: 0 }];
      }
      return prev;
    });

    setRoomMessages(prev => {
      if (!prev[dmRoomId]) {
        return {
          ...prev,
          [dmRoomId]: [{
            id: crypto.randomUUID(),
            content: `Start of your conversation with ${targetUsername}`,
            sender: "System",
            senderId: "system",
            roomId: dmRoomId,
            timestamp: new Date(),
            status: "read" as MessageStatusType,
          }]
        };
      }
      return prev;
    });

    setCurrentRoom(dmRoomId);
  }, [userId]);

  const startTyping = useCallback(() => {}, []);
  const stopTyping = useCallback(() => {}, []);

  const isDmRoom = currentRoom.startsWith("dm_");
  
  const getDmOtherUser = useCallback(() => {
    if (!isDmRoom) return null;
    const otherUserId = currentRoom.replace("dm_", "").split("_").find(id => id !== userId);
    return users.find(u => u.id === otherUserId) || null;
  }, [currentRoom, isDmRoom, userId, users]);

  useEffect(() => {
    const interval = setInterval(() => {
      const onlineUsers = users.filter(u => u.id !== userId && u.isOnline);
      if (onlineUsers.length > 0 && Math.random() > 0.7) {
        const randomUser = onlineUsers[Math.floor(Math.random() * onlineUsers.length)];
        setTypingUsers([{ id: randomUser.id, username: randomUser.username, roomId: currentRoom }]);
        setTimeout(() => setTypingUsers([]), 2000);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [users, userId, currentRoom]);

  return {
    messages,
    users,
    typingUsers: typingUsers.filter(t => t.roomId === currentRoom),
    currentRoom,
    isConnected,
    isDmRoom,
    directMessages,
    allSearchableMessages,
    getDmOtherUser,
    sendMessage,
    joinRoom,
    startDirectMessage,
    startTyping,
    stopTyping,
  };
};
