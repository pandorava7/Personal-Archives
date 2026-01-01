import React, { useState, useEffect, useRef } from 'react';
import { Trash2, Plus, Download, Upload, Settings, Home } from 'lucide-react';
import '../ToolPage.css'; // 使用通用样式
import './WheelPage.css'; // 仅保留转盘特有的 SVG 动画和指针样式
import { useSceneTransition } from '../../../App';

interface WheelConfig {
  id: string;
  title: string;
  items: string[];
}

const WheelPage: React.FC = () => {
  const { startTransition } = useSceneTransition();
  // 1. 修改初始状态，通过函数式初始化直接读取，避免多次渲染
  const [wheels, setWheels] = useState<WheelConfig[]>(() => {
    const saved = localStorage.getItem('lucky_wheels');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', title: '午餐吃什么', items: ['拉面', '汉堡', '萨莉亚', '寿司', '火锅', '沙拉'] }];
  });
  const [currentWheelIndex, setCurrentWheelIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);

  // 编辑表单状态
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editItemsRaw, setEditItemsRaw] = useState('');

  // 持久化
  useEffect(() => {
    localStorage.setItem('lucky_wheels', JSON.stringify(wheels));
  }, [wheels]);

  const currentWheel = wheels[currentWheelIndex];

  // 旋转逻辑
  const spinWheel = () => {
    if (isSpinning || !currentWheel || currentWheel.items.length === 0) return;

    const newSpin = rotation + 1800 + Math.random() * 360; // 至少转5圈
    setRotation(newSpin);
    setIsSpinning(true);
    setWinner(null);

    setTimeout(() => {
      setIsSpinning(false);
      // 计算结果
      const actualRotation = newSpin % 360;
      const itemAngle = 360 / currentWheel.items.length;
      // 这里的计算需要考虑转盘是逆时针转动还是顺时针偏移
      const index = Math.floor(((360 - (actualRotation % 360)) % 360) / itemAngle);
      setWinner(currentWheel.items[index]);
    }, 4000); // 与 CSS 动画时间一致
  };

  // 批量保存
  const handleSave = () => {
    const items = editItemsRaw
      .split(/[,\n，]/)
      .map(i => i.trim())
      .filter(i => i !== '');

    if (!editTitle || items.length < 2) {
      alert('请填写标题并至少输入两个选项');
      return;
    }

    const newWheel = { id: Date.now().toString(), title: editTitle, items };
    const updated = [...wheels];
    updated[currentWheelIndex] = newWheel;
    setWheels(updated);
    setIsEditing(false);
  };

  // 导入导出
  const exportData = () => {
    const dataStr = JSON.stringify(wheels);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const link = document.createElement('a');
    link.setAttribute('href', dataUri);
    link.setAttribute('download', 'wheels_backup.json');
    link.click();
  };

  // const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       try {
  //         const json = JSON.parse(event.target?.result as string);
  //         setWheels(json);
  //       } catch (err) {
  //         alert('无效的 JSON 文件');
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // };

  return (
    <div className="tool-container">
      <div className="glass-card">
        {/* 使用通用 Page Header */}
        <header className="page-header">
          <div className="title-area">
            <h1>幸运转盘</h1>
            <p className="subtitle">点击 GO 开启你的选择恐惧症克星</p>
          </div>
          <div className="toolbar">
            <button className="icon-btn" onClick={() => {
              const newW = { id: Date.now().toString(), title: '新转盘', items: ['选项1', '选项2'] };
              setWheels([...wheels, newW]);
              setCurrentWheelIndex(wheels.length);
            }} title="新增转盘"><Plus size={20} /></button>
            <button className="icon-btn" onClick={exportData} title="导出"><Download size={20} /></button>
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="导入"><Upload size={20} /></button>
            <button className="icon-btn" onClick={() => startTransition("/")} title="返回主页">
              <Home size={20} />
            </button>
          </div>
        </header>

        {/* 转盘选择器 (类似选项卡) */}
        <div className="wheel-selector-bar">
          {wheels.map((w, idx) => (
            <button
              key={w.id}
              className={`chip ${idx === currentWheelIndex ? 'active' : ''}`}
              onClick={() => setCurrentWheelIndex(idx)}
            >
              {w.title}
              {wheels.length > 1 && <Trash2 size={12} onClick={(e) => {
                e.stopPropagation();
                setWheels(wheels.filter((_, i) => i !== idx));
                if (currentWheelIndex >= idx) setCurrentWheelIndex(Math.max(0, currentWheelIndex - 1));
              }} />}
            </button>
          ))}
        </div>

        <main className="main-content-area">
          {!isEditing ? (
            <div className="wheel-display-zone">

              <div className='flex flex-col gap-5'>
                {winner && <div className="winner-announcement">恭喜！结果是：<span>{winner}</span></div>}

                <button className="tool-button tool-form btn-secondary" onClick={() => {
                  setEditTitle(currentWheel.title);
                  setEditItemsRaw(currentWheel.items.join('\n'));
                  setIsEditing(true);
                }
                }>
                  <Settings size={20} /> 配置选项
                </button>
              </div>

              <div className="wheel-stage">
                <div className="pointer"></div>
                <div
                  className="wheel-canvas-wrapper"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.15, 0, 0.15, 1)' : 'none'
                  }}
                >
                  <svg viewBox="0 0 100 100" className="wheel-svg">
                    {currentWheel?.items.map((item, i) => {
                      const total = currentWheel.items.length;
                      const angle = 360 / total;
                      const startAngle = i * angle;
                      const endAngle = (i + 1) * angle;

                      // 计算 SVG 弧线路径
                      const x1 = 50 + 50 * Math.cos((Math.PI * (startAngle - 90)) / 180);
                      const y1 = 50 + 50 * Math.sin((Math.PI * (startAngle - 90)) / 180);
                      const x2 = 50 + 50 * Math.cos((Math.PI * (endAngle - 90)) / 180);
                      const y2 = 50 + 50 * Math.sin((Math.PI * (endAngle - 90)) / 180);

                      const pathData = `M 50 50 L ${x1} ${y1} A 50 50 0 ${angle > 180 ? 1 : 0} 1 ${x2} ${y2} Z`;

                      return (
                        <g key={i}>
                          <path d={pathData} fill={`hsl(${(i * 360) / total}, 75%, 60%)`} stroke="#fff" strokeWidth="0.5" />
                          <text
                            x="50"
                            y="20"
                            transform={`rotate(${startAngle + angle / 2}, 50, 50)`}
                            fill="white"
                            fontSize="4"
                            fontWeight="bold"
                            textAnchor="middle"
                            style={{ userSelect: 'none' }}
                          >
                            {item}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <button className="spin-button" onClick={spinWheel} disabled={isSpinning}>
                  {isSpinning ? '...' : 'GO!'}
                </button>
              </div>
            </div>
          ) : (
            <div className="tool-form flex flex-col">
              {/* 使用与 HabitTracker 类似的表单样式 */}
              <input className="standard-input" placeholder='输入转盘标题'
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)} />
              <textarea className="standard-textarea min-h-50" placeholder='例如：拉面, 汉堡, 寿司...'
                value={editItemsRaw}
                onChange={(e) => {
                  setEditItemsRaw(e.target.value)
                }} />
              <div className="actions flex flex-row gap-5">
                <button className="tool-button btn-primary" onClick={handleSave}>完成配置</button>
                <button className="tool-button btn-secondary" onClick={() => setIsEditing(false)}>取消</button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default WheelPage;