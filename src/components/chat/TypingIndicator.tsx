import { motion } from "framer-motion";

interface TypingIndicatorProps {
  users: { username: string }[];
}

const TypingIndicator = ({ users }: TypingIndicatorProps) => {
  if (users.length === 0) return null;

  const text =
    users.length === 1
      ? `${users[0].username} is typing`
      : users.length === 2
      ? `${users[0].username} and ${users[1].username} are typing`
      : `${users[0].username} and ${users.length - 1} others are typing`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="w-2 h-2 rounded-full bg-primary"
            animate={{ y: [0, -4, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
            }}
          />
        ))}
      </div>
      <span>{text}</span>
    </motion.div>
  );
};

export default TypingIndicator;
