
import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { ArrowUp } from "lucide-react";

interface ChatInputBoxProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInputBox({ onSendMessage, isLoading }: ChatInputBoxProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;
    
    onSendMessage(message);
    setMessage("");
    
    // Focus back on textarea
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-card">
      <div className="flex space-x-2">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="마음에 담긴 이야기를 들려주세요..."
          className="resize-none bg-secondary"
          rows={2}
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          className="button-hover-effect bg-primary hover:bg-primary/90"
          disabled={!message.trim() || isLoading}
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        부담 없이 마음을 나눠보세요. HEAR는 언제든 귀 기울일 준비가 되어 있습니다.
      </p>
    </form>
  );
}
