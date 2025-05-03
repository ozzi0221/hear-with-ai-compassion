
import { cn } from "@/lib/utils";

interface AiAvatarProps {
  className?: string;
}

export default function AiAvatar({ className }: AiAvatarProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 rounded-full ai-avatar-glow"></div>
      <img 
        src="/lovable-uploads/5697182c-8a99-490d-8fb4-a7a1b8cfee19.png" 
        alt="HEAR AI" 
        className="rounded-full w-full h-full object-cover z-10 relative"
      />
    </div>
  );
}
