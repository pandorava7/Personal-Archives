import { useEffect, useState, type JSX } from "react";
import { ArrowRightLeft, Home, RefreshCw, Globe, ZapOff, AlertCircle } from "lucide-react";
import "../ToolPage.css"; // 引入通用样式
import "./CurrencyConverter.css"; // 存放特有动画或局部微调
import { useSceneTransition } from "../../../App";

type Mode = "offline" | "online";

const OFFLINE_RATES_TO_USD: Record<string, number> = {
  USD: 1, MYR: 0.21, JPY: 0.0068, TWD: 0.031, CNY: 0.14,
};

const OFFLINE_CURRENCIES = Object.keys(OFFLINE_RATES_TO_USD);

interface ExchangeApiResponse {
  base: string;
  rates: Record<string, number>;
}

export default function CurrencyConverter(): JSX.Element {
  const { startTransition } = useSceneTransition();
  const [mode, setMode] = useState<Mode>("offline");
  const [amount, setAmount] = useState<number>(1);
  const [from, setFrom] = useState<string>("USD");
  const [to, setTo] = useState<string>("MYR");
  const [result, setResult] = useState<string | null>(null);
  const [onlineRates, setOnlineRates] = useState<Record<string, number>>({});
  const [onlineCurrencies, setOnlineCurrencies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSyncHint, setShowSyncHint] = useState(false);

  useEffect(() => {
    if (mode !== "online") return;

    setShowSyncHint(false);
    setLoading(true);
    fetch(`https://api.frankfurter.app/latest?base=${from}`)
      .then(res => res.json())
      .then((data: ExchangeApiResponse) => {
        const fetchedRates = data.rates || {};
        fetchedRates[data.base] = 1;
        setOnlineRates(fetchedRates);
        setOnlineCurrencies(Object.keys(fetchedRates));
      })
      .catch(() => alert("在线汇率获取失败，请检查网络"))
      .finally(() => setLoading(false));
  }, [mode, from]);

  const handleConvert = () => {
    if (mode === "offline") {
      const usd = amount * OFFLINE_RATES_TO_USD[from];
      const final = usd / OFFLINE_RATES_TO_USD[to];
      setResult(final.toFixed(4));
      setShowSyncHint(true);
    } else {
      if (!onlineRates[to]) return;
      setResult((amount * onlineRates[to]).toFixed(4));
      setShowSyncHint(false);
    }
  };

  // 1. 删掉原有的 handleConvert 里的逻辑，或者保留它作为手动刷新
  // 2. 添加一个新的 useEffect 负责自动计算
  useEffect(() => {
    // 如果是在线模式且汇率还没加载好，先不计算
    if (mode === "online" && (!onlineRates[to] || !onlineRates[from])) {
      return;
    }

    
      setShowSyncHint(mode === "offline");

    // 执行计算逻辑
    if (mode === "offline") {
      const usd = amount * OFFLINE_RATES_TO_USD[from];
      const final = usd / OFFLINE_RATES_TO_USD[to];
      setResult(final.toFixed(4));
    } else {
      // 在线模式下：先转为 base(from)，再乘目标汇率
      // 注意：Frankfurter API 返回的是以 'from' 为基准的汇率，所以直接乘 onlineRates[to]
      setResult((amount * onlineRates[to]).toFixed(4));
    }
  }, [amount, from, to, mode, onlineRates]); // 监听这些变量的变化

  const currencyList = mode === "offline" ? OFFLINE_CURRENCIES : onlineCurrencies;

  return (
    <div className="tool-container">
      <div className="glass-card">
        <header className="page-header">
          <div className="title-area">
            <h1>汇率转换</h1>
            <p className="subtitle">支持实时在线汇率与常用离线汇率</p>
          </div>
          <div className="toolbar">
            <button
              className={`icon-btn ${mode === 'online' ? 'active-mode' : ''}`}
              onClick={() => setMode(mode === 'offline' ? 'online' : 'offline')}
              title={mode === 'offline' ? "切换到在线模式" : "切换到离线模式"}
            >
              {mode === 'offline' ? <ZapOff size={20} /> : <Globe size={20} />}
            </button>
            <button className="icon-btn" onClick={() => startTransition("/")} title="返回主页">
              <Home size={20} />
            </button>
          </div>
        </header>

        <main className="tool-content">
          <div className="tool-form">
            {/* 金额输入 */}
            <div className="input-field">
              <label>转换金额</label>
              <input
                type="number"
                className="standard-input"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </div>

            {/* 选择货币容器 */}
            <div className="currency-select-row">
              <div className="input-field">
                <label>从</label>
                <select className="standard-input" value={from} onChange={e => setFrom(e.target.value)}>
                  {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="swap-icon">
                <ArrowRightLeft size={20} />
              </div>

              <div className="input-field">
                <label>到</label>
                <select className="standard-input" value={to} onChange={e => setTo(e.target.value)}>
                  {currencyList.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          </div>

          <button className="btn-primary tool-button" onClick={handleConvert} disabled={loading}>
            {loading ? <RefreshCw className="animate-spin" /> : "立即转换"}
          </button>

          {showSyncHint && (
            <div className="sync-banner">
              <AlertCircle size={16} />
              <span>离线模式的计算结果可能有误差，建议开启线上模式（右上角闪电图标）</span>
              <button onClick={() => setShowSyncHint(false)}>×</button>
            </div>
          )}

          {result && (
            <div className="result-display fade-in">
              <div className="result-label">转换结果</div>
              <div className="result-value">
                {result} <span className="result-unit">{to}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}