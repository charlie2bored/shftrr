export interface EscapePlan {
  id: string;
  timestamp: Date;
  ventText: string;
  resumeText: string;
  aiResponse: string;
  title?: string;
}

export interface ChatRequest {
  resume_text: string;
  vent_text: string;
  temperature?: number;
  max_tokens?: number;
}

export interface ChatResponse {
  text?: string;
  done?: boolean;
  total_duration?: number;
}
