import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
  onStartDm: (userId: string, username: string) => void;
}

const UserList = ({ users, currentUserId, onStartDm }: UserListProps) => {
  const onlineUsers = users.filter((u) => u.isOnline);
  const offlineUsers = users.filter((u) => !u.isOnline);

  const handleUserClick = (user: User) => {
    if (user.id !== currentUserId) {
      onStartDm(user.id, user.username);
    }
  };

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-56 bg-chat-sidebar border-l border-chat-border h-full overflow-y-auto hidden lg:block"
    >
      <div className="p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Online — {onlineUsers.length}
        </h3>
        <div className="space-y-2">
          {onlineUsers.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserClick(user)}
              disabled={user.id === currentUserId}
              className={`w-full flex items-center gap-3 p-2 rounded-lg transition-colors group ${
                user.id === currentUserId 
                  ? "cursor-default" 
                  : "hover:bg-chat-hover cursor-pointer"
              }`}
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-medium text-primary">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-chat-sidebar" />
              </div>
              <span className="text-sm truncate flex-1 text-left">
                {user.username}
                {user.id === currentUserId && (
                  <span className="text-xs text-muted-foreground ml-1">(you)</span>
                )}
              </span>
              {user.id !== currentUserId && (
                <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
          ))}
        </div>

        {offlineUsers.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
              Offline — {offlineUsers.length}
            </h3>
            <div className="space-y-2">
              {offlineUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleUserClick(user)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg opacity-50 hover:opacity-75 hover:bg-chat-hover transition-all cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {user.username[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground truncate flex-1 text-left">
                    {user.username}
                  </span>
                  <MessageCircle className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
};

export default UserList;
