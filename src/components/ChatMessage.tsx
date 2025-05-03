
import { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const formattedTime = format(message.timestamp, "HH:mm");
  
  return (
    <div 
      className={cn(
        "mb-4 flex flex-col fade-in",
        message.type === "user" ? "items-end" : "items-start"
      )}
    >
      <div 
        className={cn(
          "message-bubble",
          message.type === "user" ? "user-message" : "ai-message"
        )}
      >
        {message.content}
      </div>
      <span className="text-xs text-muted-foreground mt-1 px-2">
        {message.type === "user" ? "나" : "HEAR"} · {formattedTime}
      </span>
    </div>
  );
}
