
// 대화 내용 타입 정의
interface MessagePart {
  text: string;
}

interface MessageContent {
  role: 'user' | 'model';
  parts: MessagePart[];
}

// 시스템 프롬프트 (Gemini API에서는 system role이 없어서 첫 메시지로 사용)
const SYSTEM_INSTRUCTION = `역할:
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

/**
 * Gemini API를 사용하여 AI 응답을 생성합니다.
 * @param userMessage 사용자의 현재 메시지
 * @param conversationHistory 이전 대화 내용 (최근 메시지만 포함)
 * @param apiKey Gemini API 키
 * @param systemInstruction 시스템 프롬프트 (옵션) - 기본값으로 SYSTEM_INSTRUCTION 사용
 * @returns 생성된 AI 응답
 */
export const generateGeminiResponse = async (
  userMessage: string,
  conversationHistory: MessageContent[] = [],
  apiKey: string,
  systemInstruction: string = SYSTEM_INSTRUCTION
): Promise<string> => {
  try {
    // 새로운 대화인 경우 (기록이 없으면) 시스템 지침 포함
    const contents: MessageContent[] = [];
    
    // 기존 대화에 시스템 지침이 포함되어 있지 않은 경우에만 추가
    if (conversationHistory.length === 0) {
      contents.push(
        {
          role: 'user',
          parts: [{ text: systemInstruction }]
        },
        {
          role: 'model',
          parts: [{ text: "안녕하세요, 저는 HEAR입니다. 오늘 어떤 기분으로 하루를 보내셨나요?" }]
        }
      );
    } else {
      // 기존 대화가 있으면 그대로 사용
      contents.push(...conversationHistory);
    }
    
    // 현재 사용자 메시지 추가
    contents.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });
    
    // Gemini API 호출
    const response = await fetch("https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });
    
    const data = await response.json();
    console.log("Gemini API 응답:", data);
    
    // API 응답 처리
    if (data.candidates && data.candidates.length > 0) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      return aiResponse;
    } else if (data.error) {
      // API 오류 처리
      console.error("Gemini API 오류:", data.error);
      return `오류가 발생했습니다: ${data.error.message || "알 수 없는 오류"}`;
    }
    
    return "응답을 처리하는 중 오류가 발생했습니다.";
  } catch (error) {
    console.error("Gemini API 요청 중 오류 발생:", error);
    return `오류가 발생했습니다: ${(error as Error).message || "알 수 없는 오류"}`;
  }
};
