import { motion } from "framer-motion";

interface User {
  id: string;
  username: string;
  isOnline: boolean;
}

interface UserListProps {
  users: User[];
  currentUserId: string;
}

const UserList = ({ users, currentUserId }: UserListProps) => {
  const onlineUsers = users.filter((u) => u.isOnline);
  const offlineUsers = users.filter((u) => !u.isOnline);

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
            <div
              key={user.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-chat-hover transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-primary/30 flex items-center justify-center text-sm font-medium text-primary">
                  {user.username[0].toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-chat-sidebar" />
              </div>
              <span className="text-sm truncate">
                {user.username}
                {user.id === currentUserId && (
                  <span className="text-xs text-muted-foreground ml-1">(you)</span>
                )}
              </span>
            </div>
          ))}
        </div>

        {offlineUsers.length > 0 && (
          <>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-6">
              Offline — {offlineUsers.length}
            </h3>
            <div className="space-y-2">
              {offlineUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg opacity-50"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
                      {user.username[0].toUpperCase()}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground truncate">
                    {user.username}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.aside>
  );
};

export default UserList;
