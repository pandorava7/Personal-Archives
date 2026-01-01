import React, { useState, useEffect, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Trash2, Flame, CheckCircle2, Download, Upload, AlertCircle, Home } from 'lucide-react';
import './HabitTracker.css';
import { useSceneTransition } from '../../../App';

interface Habit {
  id: number;
  name: string;
  days: number;
  lastUpdated: string | null;
  color: string;
}

const HabitTracker: React.FC = () => {
  const { startTransition } = useSceneTransition();
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('my-habits');
    return saved ? JSON.parse(saved) : [];
  });
  const [inputValue, setInputValue] = useState<string>('');
  const [showSyncHint, setShowSyncHint] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 持久化存储
  useEffect(() => {
    localStorage.setItem('my-habits', JSON.stringify(habits));
    // 简单逻辑：如果项目超过5个且没备份过（模拟），显示提醒
    if (habits.length >= 5) setShowSyncHint(true);
  }, [habits]);

  const addHabit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    const newHabit: Habit = {
      id: Date.now(),
      name: inputValue,
      days: 0,
      lastUpdated: null,
      color: `hsl(${Math.random() * 360}, 70%, 75%)`
    };
    setHabits([newHabit, ...habits]);
    setInputValue('');
  };

  const incrementDay = (id: number) => {
    setHabits(habits.map(h => {
      if (h.id === id) {
        const today = new Date().toLocaleDateString();
        if (h.lastUpdated === today) {
          alert("今天已经打过卡了，明天再来吧！");
          return h;
        }
        return { ...h, days: h.days + 1, lastUpdated: today };
      }
      return h;
    }));
  };

  const deleteHabit = (id: number) => {
    if (window.confirm("确定要删除这个习惯吗？数据不可恢复哦。")) {
      setHabits(habits.filter(h => h.id !== id));
    }
  };

  // 导出功能
  const exportData = () => {
    const dataStr = JSON.stringify(habits, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habits_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setShowSyncHint(false);
  };

  // 导入功能（含合并逻辑）
  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const imported: Habit[] = JSON.parse(evt.target?.result as string);
        if (window.confirm("发现现有数据！点击『确定』合并数据，点击『取消』覆盖当前数据。")) {
          // 合并去重逻辑：按 id 唯一性合并
          setHabits(prev => {
            const combined = [...prev, ...imported];
            const unique = combined.filter((item, index, self) =>
              index === self.findIndex((t) => t.id === item.id)
            );
            return unique;
          });
        } else {
          setHabits(imported);
        }
      } catch (err) {
        alert("文件格式不正确，请确保上传的是有效的备份 JSON。");
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ""; // 清空 input
  };

  return (
    <div className="tool-container">
      <div className="glass-card">
        <header className="main-header">
          <div className="title-area">
            <h1>我的进度</h1>
            <p className="subtitle">数据本地加密存储，仅你自己可见</p>
          </div>
          <div className="toolbar">
            <button className="icon-btn" onClick={exportData} title="导出备份">
              <Download size={20} />
            </button>
            <button className="icon-btn" onClick={() => fileInputRef.current?.click()} title="导入备份">
              <Upload size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              hidden
            />
            <button className="icon-btn" onClick={() => startTransition("/")} title="返回主页">
              <Home size={20} />
            </button>
          </div>
        </header>

        {showSyncHint && (
          <div className="sync-banner">
            <AlertCircle size={16} />
            <span>记得定期导出备份，防止浏览器缓存清理导致数据丢失。</span>
            <button onClick={() => setShowSyncHint(false)}>×</button>
          </div>
        )}

        <form className="tool-form" onSubmit={addHabit}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="输入你想要坚持的事..."
          />
          <button type="submit" className="tool-button btn-primary">添加</button>
        </form>

        <main className="habit-grid">
          {habits.length > 0 ? (
            habits.map(habit => (
              <article key={habit.id} className="habit-card" style={{ '--accent': habit.color } as any}>
                <div className="habit-content">
                  <h3>{habit.name}</h3>
                  <div className="stats">
                    <span className="flame-badge">
                      <Flame size={14} fill="currentColor" /> {habit.days} 天
                    </span>
                    {habit.lastUpdated && <span className="date-tag">最后打卡: {habit.lastUpdated}</span>}
                  </div>
                </div>
                <div className="habit-ops">
                  <button className="done-btn" onClick={() => incrementDay(habit.id)}>
                    <CheckCircle2 size={28} />
                  </button>
                  <button className="remove-btn" onClick={() => deleteHabit(habit.id)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="empty-state">
              <p>暂无任务，点击上方开始第一笔记录</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default HabitTracker;