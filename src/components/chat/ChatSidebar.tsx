import { motion } from "framer-motion";
import { Hash, Users, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface Room {
  id: string;
  name: string;
  unread?: number;
}

interface ChatSidebarProps {
  rooms: Room[];
  currentRoom: string;
  onRoomChange: (roomId: string) => void;
}

const rooms: Room[] = [
  { id: "general", name: "General", unread: 0 },
  { id: "random", name: "Random", unread: 2 },
  { id: "tech", name: "Tech Talk", unread: 0 },
  { id: "gaming", name: "Gaming", unread: 5 },
];

const ChatSidebar = ({ currentRoom, onRoomChange }: ChatSidebarProps) => {
  const { user, logout } = useAuth();

  return (
    <motion.aside
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-chat-sidebar border-r border-chat-border flex flex-col h-full"
    >
      <div className="p-4 border-b border-chat-border">
        <h2 className="text-lg font-semibold gradient-text">ChatRoom</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">
            Channels
          </h3>
          <div className="space-y-1">
            {rooms.map((room) => (
              <button
                key={room.id}
                onClick={() => onRoomChange(room.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${
                  currentRoom === room.id
                    ? "bg-primary/20 text-primary"
                    : "text-muted-foreground hover:bg-chat-hover hover:text-foreground"
                }`}
              >
                <Hash className="w-4 h-4" />
                <span className="flex-1 text-left">{room.name}</span>
                {room.unread ? (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-primary text-primary-foreground">
                    {room.unread}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-chat-border">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-chat-hover">
          <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username}</p>
            <p className="text-xs text-muted-foreground">Online</p>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default ChatSidebar;
