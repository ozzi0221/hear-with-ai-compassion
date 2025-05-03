
import { useState } from "react";
import LandingHero from "@/components/LandingHero";
import ChatInterface from "@/components/ChatInterface";
import { toast } from "@/components/ui/sonner";

const Index = () => {
  const [showChat, setShowChat] = useState(false);

  const handleStartChat = () => {
    setShowChat(true);
    toast("HEAR와의 대화가 시작되었습니다", {
      description: "마음 속 이야기를 자유롭게 나누어보세요.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {showChat ? (
        <div className="container max-w-4xl mx-auto h-[calc(100vh-2rem)] my-4 rounded-xl overflow-hidden border shadow-lg">
          <ChatInterface />
        </div>
      ) : (
        <div className="container max-w-4xl mx-auto">
          <LandingHero onStartChat={handleStartChat} />
        </div>
      )}
    </div>
  );
};

export default Index;
