
export type MessageType = 'user' | 'ai';

export interface Message {
  id: string;
  content: string;
  type: MessageType;
  timestamp: Date;
}

export interface EmotionSummary {
  primaryEmotion: string;
  secondaryEmotion?: string;
  intensity: number;
  notes: string;
}
