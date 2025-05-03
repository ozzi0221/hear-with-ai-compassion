
import { Button } from "./ui/button";

export default function ChatHeader() {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-card">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary/30 flex items-center justify-center">
          <span className="text-lg font-bold">H</span>
        </div>
        <div>
          <h1 className="font-bold text-lg">HEAR</h1>
          <p className="text-xs text-muted-foreground">AI 정서 동반자</p>
        </div>
      </div>
      
      <div>
        <Button variant="ghost" size="sm">
          새 대화
        </Button>
      </div>
    </div>
  );
}
