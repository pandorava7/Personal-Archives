import React, { useEffect, useState } from 'react';
import SunnyIcon from './icons/sunny.svg?react';
import CloudyIcon from './icons/cloudy.svg?react';
import RainIcon from './icons/rain.svg?react';
import SnowIcon from './icons/snow.svg?react';

interface Weather {
  temp: number; // 摄氏度
  condition: string; // 天气状态，比如 "晴", "多云", "雨", "雪"
}

const WeatherDisplay: React.FC = () => {
  const [weather, setWeather] = useState<Weather>({ temp: 0, condition: '加载中...' });

  useEffect(() => {
    const fetchWeather = async () => {
      // 这里可以替换为真实 API
      setWeather({ temp: 25, condition: '晴' });
    };
    fetchWeather();
  }, []);

  // 根据 condition 返回对应的 Icon 组件
  const getWeatherIcon = () => {
    switch (weather.condition) {
      case '晴':
        return <SunnyIcon className="w-6 h-6" />;
      case '多云':
        return <CloudyIcon className="w-6 h-6" />;
      case '雨':
        return <RainIcon className="w-6 h-6" />;
      case '雪':
        return <SnowIcon className="w-6 h-6" />;
      default:
        return <SunnyIcon className="w-6 h-6" />; // 默认图标
    }
  };

  return (
    <div className="weather flex items-center gap-2 text-white text-md gradient-text">
      {getWeatherIcon()}
      <span>{weather.temp}°C</span>
      <span>{weather.condition}</span>
    </div>
  );
};

export default WeatherDisplay;
