
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { X } from "lucide-react";

interface EmotionSummaryProps {
  onClose: () => void;
}

export default function EmotionSummary({ onClose }: EmotionSummaryProps) {
  // In a real app, this would be derived from conversation analysis
  const emotionData = {
    primaryEmotion: "불안",
    secondaryEmotion: "기대",
    intensity: 7,
    notes: "현재 상황에 대한 불안감이 있으나, 동시에 앞으로의 가능성에 대한 기대도 보입니다. 대화를 통해 불안의 원인을 더 탐색해볼 필요가 있습니다."
  };

  return (
    <Card className="mx-4 my-2 fade-in">
      <CardHeader className="pb-2 pt-4 flex flex-row justify-between items-center">
        <CardTitle className="text-lg">감정 요약</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">주요 감정:</span>
            <span className="text-sm">{emotionData.primaryEmotion}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">부가 감정:</span>
            <span className="text-sm">{emotionData.secondaryEmotion}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">감정 강도:</span>
            <div className="flex items-center">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-2 w-2 rounded-full mx-0.5 ${
                    i < emotionData.intensity ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </div>
          <div className="pt-2">
            <span className="text-sm font-medium">노트:</span>
            <p className="text-xs text-muted-foreground mt-1">
              {emotionData.notes}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
