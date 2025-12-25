import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import UserList from "./UserList";
import TypingIndicator from "./TypingIndicator";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/contexts/AuthContext";

const rooms = [
  { id: "general", name: "General" },
  { id: "random", name: "Random" },
  { id: "tech", name: "Tech Talk" },
  { id: "gaming", name: "Gaming" },
];

const ChatContainer = () => {
  const { user } = useAuth();
  const {
    messages,
    users,
    typingUsers,
    currentRoom,
    sendMessage,
    joinRoom,
    startTyping,
    stopTyping,
  } = useSocket(user?.id || "", user?.username || "");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const currentRoomName = rooms.find((r) => r.id === currentRoom)?.name || currentRoom;

  return (
    <div className="flex h-screen max-h-screen bg-background">
      <ChatSidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onRoomChange={joinRoom}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 flex flex-col min-w-0"
        style={{
          background: "linear-gradient(135deg, hsl(225 25% 8%) 0%, hsl(230 30% 12%) 100%)",
        }}
      >
        <ChatHeader roomName={currentRoomName} />

        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
          <AnimatePresence mode="popLayout">
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={{
                  id: message.id,
                  content: message.content,
                  sender: message.sender,
                  timestamp: message.timestamp,
                  isOwn: message.senderId === user?.id,
                }}
                index={index}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        </AnimatePresence>

        <ChatInput
          onSendMessage={sendMessage}
          onTyping={startTyping}
          onStopTyping={stopTyping}
        />
      </motion.div>

      <UserList users={users} currentUserId={user?.id || ""} />
    </div>
  );
};

export default ChatContainer;
