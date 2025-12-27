import { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ChatHeader from "./ChatHeader";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import ChatSidebar from "./ChatSidebar";
import UserList from "./UserList";
import TypingIndicator from "./TypingIndicator";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/hooks/useNotifications";
import { FileAttachment } from "./FilePreview";

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
    isDmRoom,
    directMessages,
    allSearchableMessages,
    getDmOtherUser,
    sendMessage,
    joinRoom,
    startDirectMessage,
    startTyping,
    stopTyping,
    editMessage,
    deleteMessage,
    toggleReaction,
    setOnNewMessage,
  } = useSocket(user?.id || "", user?.username || "");

  const { permission, requestPermission, sendNotification } = useNotifications();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previousMessagesLength = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send notification for new messages from others
  useEffect(() => {
    if (messages.length > previousMessagesLength.current) {
      const newMessages = messages.slice(previousMessagesLength.current);
      newMessages.forEach(msg => {
        if (msg.senderId !== user?.id && !msg.isDeleted) {
          sendNotification({
            title: msg.sender,
            body: msg.content || "Sent an attachment",
            tag: msg.id,
          });
        }
      });
    }
    previousMessagesLength.current = messages.length;
  }, [messages, user?.id, sendNotification]);

  const handleEnableNotifications = async () => {
    const granted = await requestPermission();
    if (granted) {
      toast.success("Notifications enabled!");
    } else {
      toast.error("Notifications permission denied");
    }
  };

  const getRoomDisplayName = () => {
    if (isDmRoom) {
      const otherUser = getDmOtherUser();
      return otherUser?.username || "Direct Message";
    }
    return rooms.find((r) => r.id === currentRoom)?.name || currentRoom;
  };

  const handleSendMessage = (content: string, attachments?: FileAttachment[]) => {
    sendMessage(content, attachments);
  };

  const handleEditMessage = (messageId: string, content: string) => {
    editMessage(messageId, content);
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    toast.success("Message deleted");
  };

  const handleReaction = (messageId: string, emoji: string) => {
    toggleReaction(messageId, emoji);
  };

  return (
    <div className="flex h-screen max-h-screen bg-background">
      <ChatSidebar
        rooms={rooms}
        currentRoom={currentRoom}
        onRoomChange={joinRoom}
        directMessages={directMessages}
        onStartDm={startDirectMessage}
        currentUserId={user?.id || ""}
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
        <ChatHeader 
          roomName={getRoomDisplayName()} 
          isDm={isDmRoom}
          searchableMessages={allSearchableMessages}
          onSelectSearchResult={joinRoom}
        >
          {permission !== "granted" && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEnableNotifications}
              className="text-muted-foreground hover:text-foreground"
              title="Enable notifications"
            >
              <BellOff className="h-5 w-5" />
            </Button>
          )}
          {permission === "granted" && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary"
              title="Notifications enabled"
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}
        </ChatHeader>

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
                  status: message.status,
                  attachments: message.attachments,
                  reactions: message.reactions,
                  isEdited: message.isEdited,
                  isDeleted: message.isDeleted,
                }}
                index={index}
                onEdit={handleEditMessage}
                onDelete={handleDeleteMessage}
                onReaction={handleReaction}
              />
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <AnimatePresence>
          {typingUsers.length > 0 && <TypingIndicator users={typingUsers} />}
        </AnimatePresence>

        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={startTyping}
          onStopTyping={stopTyping}
        />
      </motion.div>

      <UserList 
        users={users} 
        currentUserId={user?.id || ""} 
        onStartDm={startDirectMessage}
      />
    </div>
  );
};

export default ChatContainer;
