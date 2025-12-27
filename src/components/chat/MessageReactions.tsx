import { motion } from "framer-motion";

interface Reaction {
  emoji: string;
  count: number;
  userReacted: boolean;
}

interface MessageReactionsProps {
  reactions: Reaction[];
  onReactionClick: (emoji: string) => void;
}

const MessageReactions = ({ reactions, onReactionClick }: MessageReactionsProps) => {
  if (reactions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1 mt-1">
      {reactions.map((reaction) => (
        <motion.button
          key={reaction.emoji}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onReactionClick(reaction.emoji)}
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-colors ${
            reaction.userReacted
              ? "bg-primary/20 border border-primary/50 text-primary"
              : "bg-secondary border border-transparent hover:border-border text-secondary-foreground"
          }`}
        >
          <span>{reaction.emoji}</span>
          <span className="font-medium">{reaction.count}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default MessageReactions;
