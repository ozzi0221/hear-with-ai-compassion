
import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInputBox from "./ChatInputBox";
import ChatMessage from "./ChatMessage";
import EmotionSummary from "./EmotionSummary";
import { Message } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";

const INITIAL_MESSAGES: Message[] = [
  {
    id: uuidv4(),
    content: "안녕하세요, 저는 HEAR입니다. 오늘 어떤 기분으로 하루를 보내셨나요?",
    type: "ai",
    timestamp: new Date(),
  },
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // In a real application, we would use the Gemini API here
  const generateAIResponse = async (userMessage: string): Promise<string> => {
    // Simulate API call
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Simple responses based on message content
    if (userMessage.includes("안녕") || userMessage.includes("반가워")) {
      return "안녕하세요! 오늘 어떤 일들이 있으셨나요?";
    } 
    else if (userMessage.includes("힘들") || userMessage.includes("어려") || userMessage.includes("우울")) {
      return "정말 힘드셨겠네요. 그런 감정을 느끼는 건 자연스러운 일이에요. 더 자세히 이야기해 주실 수 있을까요?";
    }
    else if (userMessage.includes("도와줘") || userMessage.includes("도움")) {
      return "도움이 필요하시군요. 제가 어떻게 도와드리면 좋을까요? 지금 마음이 어떤지 조금만 더 이야기해주세요.";
    }
    else {
      return "말씀해주셔서 감사합니다. 더 듣고 싶어요. 그 상황에서 어떤 감정을 느끼셨나요?";
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate and add AI response
    const aiResponse = await generateAIResponse(content);
    const aiMessage: Message = {
      id: uuidv4(),
      content: aiResponse,
      type: "ai",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, aiMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader />
      
      <div className="flex-1 overflow-y-auto p-4 chat-gradient">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isLoading && (
          <div className="ai-message message-bubble flex items-center space-x-2 my-2">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div>HEAR가 응답 중입니다...</div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {showSummary && <EmotionSummary onClose={() => setShowSummary(false)} />}
      
      <div className="p-2 border-t flex justify-center">
        <Button 
          variant="outline"
          className="mx-2 button-hover-effect"
          onClick={() => setShowSummary(!showSummary)}
        >
          감정 요약 보기
        </Button>
      </div>
      
      <ChatInputBox onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}
