import { useState, useEffect, useCallback } from 'react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface UseGeminiChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => void;
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

interface GeminiMessagePart {
  text: string;
}

interface GeminiMessage {
  role: 'user' | 'model';
  parts: GeminiMessagePart[];
}

const STORAGE_KEY = 'bishell_gemini_chat_history';
const API_KEY = 'AIzaSyDbW33CM_oTWhIOzTsJDRf4A39roukix0Q';
const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `Act as u are study mate for the students using you, yourname is Elda7e7, you should act like a nerdy study mate try to answer their question with detials and exmaples if needed, and answer in egptian arabic if they doesn't specify an prefered language, you working for BIShell site.`;

export const useGeminiChat = (): UseGeminiChatReturn => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedChat = localStorage.getItem(STORAGE_KEY);
    
    if (savedChat) {
      try {
        const parsedChat = JSON.parse(savedChat) as ChatMessage[];
        setMessages(parsedChat);
      } catch (err) {
        console.error('Failed to parse saved chat:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      const welcomeMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: ' أهلا بيك! أنا الضحيح، المساعد الدراسي بتاعك. ممكن تسألني أي حاجة وأنا هحاول أجاوبك بالتفصيل! أنا هنا عشان أساعدك في المذاكرة وحل المسائل وكمان هشرحلك أي موضوع بطريقة سهلة. إيه اللي محتاج مساعدة فيه النهاردة؟ هديك نبذة عن الطلبة والخلفية التعلمية اللي عندهم هما طلبة نظم معلومات الاعمال يعني ليهم فالبرمجة والمحاسبة وادارة الاعمال',
        timestamp: Date.now()
      };
      
      setMessages([welcomeMessage]);
      localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeMessage]));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const generateId = () => {
    return Math.random().toString(36).substring(2, 11);
  };

  const formatChatForGemini = (chatMessages: ChatMessage[]): GeminiMessage[] => {
    const formattedHistory: GeminiMessage[] = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }]
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am Elda7e7, a nerdy study mate for BISHell site users and friendly one. I will provide detailed answers with examples when needed and respond in Egyptian Arabic unless another language is requested.' }]
      }
    ];
    
    chatMessages.slice(-10).forEach(msg => {
      formattedHistory.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      });
    });
    
    return formattedHistory;
  };

  const clearChat = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: 'أهلا بيك! أنا الدحيح، المساعد الدراسي بتاعك. ممكن تسألني أي حاجة وأنا هحاول أجاوبك بالتفصيل! أنا هنا عشان أساعدك في المذاكرة وحل المسائل وكمان هشرحلك أي موضوع بطريقة سهلة. إيه اللي محتاج مساعدة فيه النهاردة؟',
      timestamp: Date.now()
    };
    
    setMessages([welcomeMessage]);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([welcomeMessage]));
  }, []);

  const sendMessage = useCallback(async (userMessage: string): Promise<void> => {
    if (!userMessage.trim()) return;
    
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: userMessage,
      timestamp: Date.now()
    };
    
    setMessages(prevMessages => [...prevMessages, userMsg]);
    setIsLoading(true);
    setError(null);
    
    try {
      const allMessages = [...messages, userMsg];
      const chatHistory = formatChatForGemini(allMessages);
      
      const response = await fetch(`${API_URL}?key=${API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: chatHistory,
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const data = await response.json() as GeminiResponse;
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response from AI');
      }
      
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: aiResponse,
        timestamp: Date.now()
      };
      
      setMessages(prevMessages => [...prevMessages, assistantMsg]);
    } catch (err) {
      console.error('Error communicating with Gemini:', err);
      setError(err instanceof Error ? err.message : 'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};