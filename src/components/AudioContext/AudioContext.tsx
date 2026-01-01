import React, { createContext, useRef, useContext, type ReactNode, useState } from 'react';

// 1. 定义 Context 的数据接口
interface MusicContextType {
  playMusic: (src: string) => void;
  stopMusic: () => void;
  volume: number;
  adjustVolume: (newVolume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 使用 useRef 存储音频实例，避免重新渲染时丢失或重复创建
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<number | null>(null);

  // 增加 volume 状态
  const [volume, setVolume] = useState(0.5); // 初始音量 50%

  const clearFade = () => {
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
  };

  const playMusic = (src: string, startTime = 0) => {
    clearFade();

    // 如果是新歌，则创建；如果是同一首歌且在暂停，则恢复
    if (!audioRef.current || audioRef.current.src !== src) {
      audioRef.current = new Audio(src);
      audioRef.current.loop = true;
    }

    const audio = audioRef.current;
    audio.currentTime = startTime;
    audio.volume = 0; // 从静音开始淡入
    audio.play();

    // 淡入逻辑
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume < volume - 0.01) {
        audio.volume += 0.01;
      } else {
        audio.volume = volume;
        clearFade();
      }
    }, 100); // 每50毫秒增加一点音量
  };

  const stopMusic = () => {
    clearFade();
    const audio = audioRef.current;
    if (!audio) return;

    // 淡出逻辑
    fadeIntervalRef.current = setInterval(() => {
      if (audio.volume > 0.05) {
        audio.volume -= 0.05;
      } else {
        audio.volume = 0;
        audio.pause();
        clearFade();
      }
    }, 50);
  };

  // 调整音量的函数
  const adjustVolume = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <MusicContext.Provider value={{ playMusic, stopMusic, volume, adjustVolume }}>
      {children}
    </MusicContext.Provider>
  );
};

// 自定义 Hook 方便其他组件调用
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) throw new Error("useMusic must be used within a MusicProvider");
  return context;
};