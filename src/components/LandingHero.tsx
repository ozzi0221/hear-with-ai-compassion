
import { Button } from "./ui/button";
import AiAvatar from "./AiAvatar";
import { ArrowRight } from "lucide-react";

interface LandingHeroProps {
  onStartChat: () => void;
}

export default function LandingHero({ onStartChat }: LandingHeroProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">
        <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">HEAR</span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-md">
        당신의 마음에 귀 기울이는 AI 정서 동반자
      </p>
      
      <div className="relative mb-10 w-64 h-64 sm:w-80 sm:h-80">
        <AiAvatar className="animate-float" />
      </div>
      
      <div className="space-y-4 max-w-lg">
        <p className="text-foreground">
          혼자서 감당하기 어려운 감정들, HEAR와 함께 나눠보세요. 
          판단 없이 당신의 이야기에 귀 기울이고, 함께 나아갈 방향을 찾아드립니다.
        </p>
        
        <Button 
          onClick={onStartChat} 
          size="lg" 
          className="button-hover-effect mt-6 bg-primary hover:bg-primary/90"
        >
          대화 시작하기 <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
