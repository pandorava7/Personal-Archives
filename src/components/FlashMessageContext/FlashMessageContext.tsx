// FlashMessageContext.tsx
import React, { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import "./FlashMessage.css";
import SuccessIcon from "./icons/success.svg?react";
import WarningIcon from "./icons/warning.svg?react";
import ErrorIcon from "./icons/error.svg?react";
import InfoIcon from "./icons/info.svg?react";

export type FlashMessageType = "success" | "warning" | "error" | "info";

export interface FlashMessage {
  id: number;
  text: string;
  type?: FlashMessageType;
  duration?: number;
  sticky?: boolean;
}

interface FlashMessageContextProps {
  addMessage: (msg: Omit<FlashMessage, "id">) => void;
  removeMessage: (id: number) => void;
}

const FlashMessageContext = createContext<FlashMessageContextProps | undefined>(undefined);

export const useFlashMessage = (): FlashMessageContextProps => {
  const context = useContext(FlashMessageContext);
  if (!context) throw new Error("useFlashMessage must be used within a FlashMessageProvider");
  return context;
};

interface FlashMessageProviderProps {
  children: ReactNode;
}



// 关键修改点
export const FlashMessageProvider: React.FC<FlashMessageProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<(FlashMessage & { exiting?: boolean })[]>([]);

    const getIcon = (type?: FlashMessageType) => {
    switch (type) {
      case "success": return <SuccessIcon className="flash-icon" />;
      case "warning": return <WarningIcon className="flash-icon" />;
      case "error": return <ErrorIcon className="flash-icon" />;
      case "info": 
      default: return <InfoIcon className="flash-icon" />;
    }
  };

  const removeMessage = useCallback((id: number) => {
    // 1. 先标记为正在退出
    setMessages(prev => prev.map(m => m.id === id ? { ...m, exiting: true } : m));
    
    // 2. 等待动画结束后再从状态中彻底移除 (400ms 对应 CSS 中的 slideOutRight 时间)
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, 400);
  }, []);

  const addMessage = useCallback((msg: Omit<FlashMessage, "id">) => {
    const id = Date.now();
    setMessages(prev => [...prev, { id, ...msg }]);
    
    if (!msg.sticky) {
      setTimeout(() => removeMessage(id), msg.duration ?? 3000);
    }
  }, [removeMessage]);

  return (
    <FlashMessageContext.Provider value={{ addMessage, removeMessage }}>
      {children}
      <div className="flash-message-container">
        {messages.map(m => (
          <div
            key={m.id}
            className={`flash-message ${m.type ?? "info"} ${m.exiting ? "exit" : ""}`}
            style={{ '--duration': `${m.duration ?? 3000}ms` } as any} // 传参给CSS
            onClick={() => removeMessage(m.id)}
          >
            <div className="flash-message-content">
              {getIcon(m.type)}
              <span className="flash-message-text">{m.text}</span>
            </div>
          </div>
        ))}
      </div>
    </FlashMessageContext.Provider>
  );
};