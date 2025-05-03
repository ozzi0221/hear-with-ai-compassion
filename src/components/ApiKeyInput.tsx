
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ApiConfig } from "@/types/chat";

interface ApiKeyInputProps {
  apiConfig: ApiConfig;
  onSave: (config: ApiConfig) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ApiKeyInput({ apiConfig, onSave, open, onOpenChange }: ApiKeyInputProps) {
  const [apiKey, setApiKey] = useState(apiConfig.apiKey || "");

  const handleSave = () => {
    onSave({
      apiKey,
      isConfigured: apiKey.trim().length > 0
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gemini API 설정</DialogTitle>
          <DialogDescription>
            Google Gemini API 키를 입력하여 AI 대화 기능을 활성화하세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apiKey" className="text-right">
              API 키
            </Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Gemini API 키를 입력하세요"
              className="col-span-3"
            />
          </div>
          
          <div className="col-span-4 text-xs text-muted-foreground mt-2">
            <p>Gemini API 키는 로컬에 저장되며 외부로 전송되지 않습니다.</p>
            <p className="mt-1">API 키가 없으신가요? <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-primary hover:underline">Google AI 스튜디오</a>에서 발급받으세요.</p>
            <p className="mt-1">API 키 형식: "AI..." 로 시작하는 문자열입니다.</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button type="button" onClick={handleSave} disabled={!apiKey.trim()}>
            저장하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
