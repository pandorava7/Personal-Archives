import React, { useState, useEffect } from 'react';
import './TimeDisplay.css';

const TimeDisplay: React.FC = () => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime(); // 立即显示
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return <p className="time gradient-text">{time}</p>;
};

export default TimeDisplay;
