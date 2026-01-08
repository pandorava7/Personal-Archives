import React, { type CSSProperties, useState, useRef, useEffect, useCallback } from "react";
import "./ParallaxMap.css";
import { Volume, Volume1, Volume2, VolumeOff, Home, Gauge } from 'lucide-react';

// 资源导入
import Flower1 from "@/assets/images/layer/act2_flower1.png";
import Flower2 from "@/assets/images/layer/act2_flower2.png";
import Shards1 from "@/assets/images/layer/act2_shards1.png";
import Shards2 from "@/assets/images/layer/act2_shards2.png";
import World from "@/assets/images/layer/world2.jpg";

import Line from "../../components/Line/Line";
import MiniDiamondButton from "../../components/MiniDiamondButton/MiniDiamondButton";
import { useMusic } from "../../components/AudioContext/AudioContext";
import { useSceneTransition } from "../../App";
import { ASSET_BASE_URL } from "../../config/assets";

// --- 常量定义 ---
type OverlayState = "closed" | "typing" | "done";

const SPEEDS = { world: 0.1, flower1: 0.12, shards1: 0.14, shards2: 0.15, flower2: 0.16, ui: 0.5 };
const SCALE_FACTORS = { world: 0.1, flower1: 0.12, shards1: 0.14, shards2: 0.15, flower2: 0.16, ui: 0.5 };
const SPEED_MULTIPLIERS = [1, 1.5, 2, 3];
const SCALE_OPTIONS = [0.8, 1, 1.2];
const CONTENT_SIZE = { width: 2000, height: 2000 };

const getTextUrl = (id: string) => `${ASSET_BASE_URL}/world/txt/${id}.txt`;

const ParallaxMap: React.FC = () => {
    // --- 外部 Hook ---
    const { startTransition } = useSceneTransition();
    const { volume, adjustVolume } = useMusic();

    // --- 1. 文本打字机状态 ---
    const [overlayState, setOverlayState] = useState<OverlayState>("closed");
    const [fullText, setFullText] = useState("");
    const [displayText, setDisplayText] = useState("");
    const typingTimerRef = useRef<number | null>(null);
    const typingIndexRef = useRef(0);

    // --- 2. 地图变换状态 ---
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [currentScale, setCurrentScale] = useState(1);
    const [moveSpeedMultiplier, setMoveSpeedMultiplier] = useState(1);

    // --- 3. 交互/动画引用 ---
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>(0);

    // --- 逻辑处理：文本显示 ---
    const openText = async (id: string) => {
        try {
            const res = await fetch(getTextUrl(id));
            const text = await res.text();
            setFullText(text);
            setDisplayText("");
            typingIndexRef.current = 0;
            setOverlayState("typing");
        } catch (error) {
            console.error("Failed to load text:", error);
        }
    };

    useEffect(() => {
        if (overlayState !== "typing") return;

        typingTimerRef.current = window.setInterval(() => {
            typingIndexRef.current++;
            setDisplayText(fullText.slice(0, typingIndexRef.current));

            if (typingIndexRef.current >= fullText.length) {
                if (typingTimerRef.current) clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
                setOverlayState("done");
            }
        }, 50);

        return () => {
            if (typingTimerRef.current) clearInterval(typingTimerRef.current);
        };
    }, [overlayState, fullText]);

    const pointerDownRef = useRef<{
        x: number;
        y: number;
        time: number;
    } | null>(null);

    const MOVE_THRESHOLD = 6;     // 像素
    const TIME_THRESHOLD = 300;   // ms（可选）

    const onOverlayPointerDown = (e: React.PointerEvent) => {
        pointerDownRef.current = {
            x: e.clientX,
            y: e.clientY,
            time: Date.now()
        };
    };

    const onOverlayPointerUp = (e: React.PointerEvent) => {
        if (!pointerDownRef.current) return;

        const dx = e.clientX - pointerDownRef.current.x;
        const dy = e.clientY - pointerDownRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const duration = Date.now() - pointerDownRef.current.time;

        pointerDownRef.current = null;

        if (distance > MOVE_THRESHOLD) return;
        if (duration > TIME_THRESHOLD) return;

        // ✅ 只有真正的“点击”才走这里
        handleOverlayClick();
    };


    const handleOverlayClick = () => {
        if (overlayState === "typing") {
            if (typingTimerRef.current) {
                clearInterval(typingTimerRef.current);
                typingTimerRef.current = null;
            }
            setDisplayText(fullText);
            setOverlayState("done");
            return;
        }
        if (overlayState === "done") {
            setOverlayState("closed");
            setFullText("");
            setDisplayText("");
        }
    };

    // 每次文字尾端闪烁时变化的颜文字和颜色
    const cursorFaces = ["ฅ^•ﻌ•^ฅ", "Q A Q", "(≧▽≦)", "✧(≖ ◡ ≖✿)", "| ᐕ)⁾⁾"];
    const cursorColors = ["#ff5f5f", "#5fafff", "#ffd75f", "#aaff5f", "#ff5fff"];
    const [currentFace, setCurrentFace] = useState(cursorFaces[0]);
    const [currentColor, setCurrentColor] = useState(cursorColors[0]);

    useEffect(() => {
        if (overlayState === "typing") {
            const interval = setInterval(() => {
                // 随机挑一个颜文字
                const nextFace = cursorFaces[Math.floor(Math.random() * cursorFaces.length)];
                const nextColor = cursorColors[Math.floor(Math.random() * cursorColors.length)];
                setCurrentFace(nextFace);
                setCurrentColor(nextColor);
            }, 1000); // 每1000ms切换一次，你可以调快或慢
            return () => clearInterval(interval);
        }
    }, [overlayState]);

    // --- 逻辑处理：边界限制 ---
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    const getBoundaries = useCallback(() => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const scaledW = CONTENT_SIZE.width * currentScale;
        const scaledH = CONTENT_SIZE.height * currentScale;
        const maxSpeed = SPEEDS.flower2;

        const limitX = Math.max(0, (scaledW - vw) / 2 / maxSpeed);
        const limitY = Math.max(0, (scaledH - vh) / 2 / maxSpeed);

        return { limitX, limitY };
    }, [currentScale]);

    // --- 逻辑处理：惯性动画 ---
    const animate = useCallback(() => {
        if (!isDragging.current) {
            if (Math.abs(velocity.current.x) > 0.01 || Math.abs(velocity.current.y) > 0.01) {
                velocity.current.x *= 0.92;
                velocity.current.y *= 0.92;

                setOffset((prev) => {
                    const { limitX, limitY } = getBoundaries();
                    return {
                        x: clamp(prev.x + velocity.current.x, -limitX, limitX),
                        y: clamp(prev.y + velocity.current.y, -limitY, limitY)
                    };
                });
            }
        }
        requestRef.current = requestAnimationFrame(animate);
    }, [getBoundaries]);

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, [animate]);

    // --- 交互处理 ---
    const handleStart = (clientX: number, clientY: number) => {
        isDragging.current = true;
        lastPos.current = { x: clientX, y: clientY };
        velocity.current = { x: 0, y: 0 };
    };

    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging.current) return;

        const dx = (clientX - lastPos.current.x) * moveSpeedMultiplier;
        const dy = (clientY - lastPos.current.y) * moveSpeedMultiplier;

        velocity.current = { x: dx, y: dy };
        setOffset((prev) => {
            const nextX = prev.x + dx;
            const nextY = prev.y + dy;
            const { limitX, limitY } = getBoundaries();
            return {
                x: clamp(nextX, -limitX, limitX),
                y: clamp(nextY, -limitY, limitY)
            };
        });
        lastPos.current = { x: clientX, y: clientY };
    };

    const handleZoom = (nextScale: number) => {
        if (nextScale === currentScale) return;
        const ratio = nextScale / currentScale;
        setOffset(prev => ({
            x: prev.x * ratio,
            y: prev.y * ratio
        }));
        setCurrentScale(nextScale);
    };

    const toggleMoveSpeed = () => {
        setMoveSpeedMultiplier(prev => {
            const currentIndex = SPEED_MULTIPLIERS.indexOf(prev);
            return SPEED_MULTIPLIERS[(currentIndex + 1) % SPEED_MULTIPLIERS.length];
        });
    };

    // 缩放后校验边界
    useEffect(() => {
        const { limitX, limitY } = getBoundaries();
        setOffset(prev => ({
            x: clamp(prev.x, -limitX, limitX),
            y: clamp(prev.y, -limitY, limitY)
        }));
    }, [currentScale, getBoundaries]);

    // --- 样式计算 ---
    const getLayerStyle = (layerName: keyof typeof SPEEDS): CSSProperties => {
        const speed = SPEEDS[layerName];
        const factor = SCALE_FACTORS[layerName];
        const layerScale = 1 + (currentScale - 1) * factor;

        return {
            transform: `translate(${offset.x * speed}px, ${offset.y * speed}px) scale(${layerScale})`,
            zIndex: Math.floor(speed * 100),
            transition: isDragging.current ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
            transformOrigin: "center center",
        };
    };

    const renderIcon = () => {
        const iconProps = { size: 20, color: "#ffffff" };
        if (volume === 0) return <VolumeOff {...iconProps} />;
        if (volume < 0.3) return <Volume {...iconProps} />;
        if (volume < 0.7) return <Volume1 {...iconProps} />;
        return <Volume2 {...iconProps} />;
    };

    return (
        <div className="parallax-map-wrapper">
            {/* 文本遮罩层 */}
            {overlayState !== "closed" && (
                <div
                    className="overlay-mask"
                    onPointerDown={onOverlayPointerDown}
                    onPointerUp={onOverlayPointerUp}
                >
                    <div className="overlay-center pointer-events-none">
                        <div className="overlay-text-box pointer-events-auto">
                            {displayText}
                            {overlayState === "typing" && (
                                <span className="typing-cursor" style={{color: currentColor}}>  {currentFace}</span>
                            )}
                        </div>
                    </div>
                </div>
            )}


            {/* 地图视口 */}
            <div
                className="map-viewport"
                onMouseDown={(e) => handleStart(e.clientX, e.clientY)}
                onMouseMove={(e) => handleMove(e.clientX, e.clientY)}
                onMouseUp={() => (isDragging.current = false)}
                onMouseLeave={() => (isDragging.current = false)}
                onTouchStart={(e) => handleStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={() => (isDragging.current = false)}
            >
                {/* 控制面板 */}
                <div className="control-buttons">
                    <div className="control">
                        <div className="volume-container flex items-center gap-3">
                            <div
                                className="icon cursor-pointer hover:text-blue-400 transition-colors"
                                onClick={() => adjustVolume(volume > 0 ? 0 : 0.1)}
                            >
                                {renderIcon()}
                            </div>
                            <input
                                type="range" min="0" max="1" step="0.01"
                                value={volume}
                                onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                                className="slider w-24 accent-blue-500 cursor-pointer"
                            />
                            <span className="label text-xs font-mono w-8 text-white/80">
                                {Math.round(volume * 100)}%
                            </span>
                        </div>
                    </div>

                    <div className="control">
                        {SCALE_OPTIONS.map((s) => (
                            <button
                                key={s}
                                className={currentScale === s ? "active" : ""}
                                onClick={(e) => { e.stopPropagation(); handleZoom(s); }}
                            >
                                {s * 100}%
                            </button>
                        ))}
                    </div>

                    <div className="control">
                        <button
                            className="p-2 flex items-center justify-center hover:bg-white/20 transition-colors"
                            onClick={(e) => { e.stopPropagation(); startTransition("/"); }}
                            title="回到首页"
                        >
                            <Home size={20} color="#ffffff" />
                        </button>
                    </div>

                    <div className="control">
                        <button
                            className="p-2 flex items-center gap-2 hover:bg-white/20 transition-colors min-w-[70px]"
                            onClick={(e) => { e.stopPropagation(); toggleMoveSpeed(); }}
                            title="切换拖拽速度"
                        >
                            <Gauge size={20} color={moveSpeedMultiplier > 1 ? "#60a5fa" : "#ffffff"} />
                            <span className="text-xs font-mono text-white">x{moveSpeedMultiplier}</span>
                        </button>
                    </div>
                </div>

                {/* 视差层容器 */}
                <div
                    className="map-container"
                    style={{
                        transform: `scale(${currentScale})`,
                        transition: "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)"
                    } as CSSProperties}
                >
                    <div className="layer" style={getLayerStyle('world')}>
                        <img src={World} draggable={false} alt="world" />
                    </div>
                    <div className="layer top-0 left-50" style={getLayerStyle('flower1')}>
                        <img src={Flower1} draggable={false} alt="flower1" />
                    </div>
                    <div className="layer top-100 left-0" style={getLayerStyle('shards1')}>
                        <img src={Shards1} draggable={false} alt="shards1" />
                    </div>
                    <div className="layer top-100 left-0" style={getLayerStyle('shards2')}>
                        <img src={Shards2} draggable={false} alt="shards2" />
                    </div>
                    <div className="layer top-0 left-20" style={getLayerStyle('flower2')}>
                        <img src={Flower2} draggable={false} alt="flower2" />
                    </div>

                    {/* UI 层 */}
                    <div className="layer ui-layer" style={getLayerStyle('ui')}>
                        <div style={{ position: "absolute", left: 960, top: 960, zIndex: 2, width: 1000, height: 1000 }}>
                            <div style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}>
                                <MiniDiamondButton bg={1} size={80} onClick={() => openText("1-1")}>
                                    1-1
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -200, zIndex: 2 }}>
                                <MiniDiamondButton bg={1} size={80} onClick={() => openText("1-2")}>
                                    1-2
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -400, zIndex: 2 }}>
                                <MiniDiamondButton bg={1} size={80} onClick={() => openText("1-3")}>
                                    1-3
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -600, zIndex: 2 }}>
                                <MiniDiamondButton bg={2} size={80} onClick={() => openText("1-4")}>
                                    1-4
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -800, zIndex: 2 }}>
                                <MiniDiamondButton bg={2} size={80} onClick={() => openText("1-5")}>
                                    1-5
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -1000, zIndex: 2 }}>
                                <MiniDiamondButton bg={2} size={80} onClick={() => openText("1-6")}>
                                    1-6
                                </MiniDiamondButton>
                            </div>
                            <div style={{ position: "absolute", left: 0, top: -1200, zIndex: 2 }}>
                                <MiniDiamondButton bg={2} size={80} onClick={() => openText("1-7")}>
                                    1-7
                                </MiniDiamondButton>
                            </div>
                            {/* 连线 */}
                            <Line start={{ x: 40, y: 40 }} end={{ x: 40, y: -1140 }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParallaxMap;