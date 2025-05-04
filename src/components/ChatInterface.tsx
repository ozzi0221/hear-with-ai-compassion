import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInputBox from "./ChatInputBox";
import ChatMessage from "./ChatMessage";
import EmotionSummary from "./EmotionSummary";
import ApiKeyInput from "./ApiKeyInput";
import { Message, ApiConfig, EmotionSummary as EmotionSummaryType } from "@/types/chat";
import { Button } from "./ui/button";
import { Settings } from "lucide-react";
import { nanoid } from "nanoid";
import { toast } from "@/components/ui/sonner";
import { generateGeminiResponse } from "@/lib/gemini-api";

const INITIAL_MESSAGES: Message[] = [
  {
    id: nanoid(),
    content: "안녕하세요, 저는 HEAR입니다. 오늘 어떤 기분으로 하루를 보내셨나요?",
    type: "ai",
    timestamp: new Date(),
  },
];

const API_CONFIG_KEY = "hear-api-config";

// 시스템 프롬프트 (Gemini API에서는 system role이 없어서 첫 메시지로 사용)
const SYSTEM_PROMPT = `역할:
너는 공감 능력이 뛰어난 AI 상담사야. 이름은 "HEAR"야. 사용자의 감정과 심리 상태를 파악하고,
비판하지 않으며 따뜻하게 대화를 이끌어야 해.

목표:
- 사용자와 정서적으로 연결되어 마음의 짐을 덜어주는 것
- 감정을 파악하고 요약하는 것
- 사용자의 문제를 유추하고 필요시 현실적인 방향을 제시하는 것

대화 흐름:
1. 감정 체크 질문 (예: 요즘 어때요? 최근에 가장 많이 든 생각은요?)
2. 사용자의 감정 단서를 포착하고, 공감 표현
3. 문제의 원인을 부드럽게 유도 (경험/기억/상황)
4. 긍정적인 리마인드 or 선택지 제안 (예: "혹시 이런 식으로 풀어볼까요?")
5. 감정 요약 (예: "지금은 외로움과 불안이 섞여 있는 것 같아요")
6. 기록용으로 사용자 감정/상태를 간단히 정리한 요약 생성

대화 톤:
- 따뜻하고 부드럽게 말해
- 판단하지 않아
- 친근하지만 조심스러운 말투로

조건:
- 절대 해결책을 단정적으로 제시하지 않아
- 자살, 극단적 선택 언급이 있다면 응급 대화 모드로 바꾸고 경고/지원 안내를 포함해`;

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const savedConfig = localStorage.getItem(API_CONFIG_KEY);
    return savedConfig 
      ? JSON.parse(savedConfig) 
      : { apiKey: "", isConfigured: false };
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!apiConfig.isConfigured) {
      setApiKeyDialogOpen(true);
    }
  }, [apiConfig.isConfigured]);

  const saveApiConfig = (config: ApiConfig) => {
    setApiConfig(config);
    localStorage.setItem(API_CONFIG_KEY, JSON.stringify(config));
    
    if (config.isConfigured) {
      toast("Gemini API 설정 완료", {
        description: "이제 AI와 대화할 준비가 되었습니다.",
      });
    }
  };
  
  const processAIResponse = async (userMessage: string): Promise<string> => {
    // Check if API is configured
    if (!apiConfig.isConfigured) {
      setApiKeyDialogOpen(true);
      return "Gemini API 키를 먼저 설정해주세요.";
    }

    setIsLoading(true);
    
    try {
      // 이전 대화 내용을 구성합니다 (처음 메시지 제외하고 최근 5개로 제한)
      const conversationHistory = messages
        .slice(-5)  // 최근 5개 메시지만 포함
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
      
      const response = await generateGeminiResponse(
        userMessage,
        conversationHistory,
        apiConfig.apiKey
      );
      
      return response;
    } catch (error) {
      console.error("API 요청 중 오류 발생:", error);
      toast.error("API 요청 오류", {
        description: "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요."
      });
      return "네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.";
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: nanoid(),
      content,
      type: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Generate and add AI response
    const aiResponse = await processAIResponse(content);
    const aiMessage: Message = {
      id: nanoid(),
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
      
      <div className="p-2 border-t flex justify-between items-center">
        <Button 
          variant="outline"
          size="icon"
          className="button-hover-effect"
          onClick={() => setApiKeyDialogOpen(true)}
          title="API 설정"
        >
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline"
          className="mx-2 button-hover-effect"
          onClick={() => setShowSummary(!showSummary)}
        >
          감정 요약 보기
        </Button>
        
        <div className="w-9"></div> {/* Placeholder for alignment */}
      </div>
      
      <ChatInputBox onSendMessage={handleSendMessage} isLoading={isLoading} />
      
      <ApiKeyInput 
        apiConfig={apiConfig}
        onSave={saveApiConfig}
        open={apiKeyDialogOpen}
        onOpenChange={setApiKeyDialogOpen}
      />
    </div>
  );
}
