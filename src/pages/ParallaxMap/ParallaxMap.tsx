import React, { type CSSProperties, useState, useRef, useEffect, useCallback } from "react";
import "./ParallaxMap.css";
import { Volume, Volume1, Volume2, VolumeOff, Home, Gauge } from 'lucide-react';

// 资源导入...
import Flower1 from "@/assets/images/layer/act2_flower1.png";
import Flower2 from "@/assets/images/layer/act2_flower2.png";
import Shards1 from "@/assets/images/layer/act2_shards1.png";
import Shards2 from "@/assets/images/layer/act2_shards2.png";
import World from "@/assets/images/layer/world2.jpg";
import Line from "../../components/Line/Line";
import MiniDiamondButton from "../../components/MiniDiamondButton/MiniDiamondButton";
import { useMusic } from "../../components/AudioContext/AudioContext";
import { useSceneTransition } from "../../App";

const SPEEDS = { world: 0.1, flower1: 0.12, shards1: 0.14, shards2: 0.15, flower2: 0.16, ui: 0.5 };
// 定义速度倍率选项
const SPEED_MULTIPLIERS = [1, 1.5, 2, 3];
const SCALE_OPTIONS = [0.8, 1, 1.2];
// 权重越大，随着 currentScale 变化时，该层放大/缩小的幅度越明显
const SCALE_FACTORS = {
    world: 0.1, flower1: 0.12, shards1: 0.14, shards2: 0.15, flower2: 0.16, ui: 0.5
};
// 假设你的设计稿/原始图片尺寸
const CONTENT_SIZE = { width: 2000, height: 2000 };

const ParallaxMap: React.FC = () => {
    const { startTransition } = useSceneTransition();
    const { volume, adjustVolume } = useMusic();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const nextVolume = parseFloat(e.target.value);
        adjustVolume(nextVolume);
    };

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [currentScale, setCurrentScale] = useState(1);

    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const requestRef = useRef<number>(0);

    const [moveSpeedMultiplier, setMoveSpeedMultiplier] = useState(1);

    // 切换速度函数
    const toggleMoveSpeed = () => {
        setMoveSpeedMultiplier(prev => {
            const currentIndex = SPEED_MULTIPLIERS.indexOf(prev);
            return SPEED_MULTIPLIERS[(currentIndex + 1) % SPEED_MULTIPLIERS.length];
        });
    };

    // 【核心：边界限制计算】
    // 我们根据位移最大的层(ui或flower2)来计算偏移极限，确保它不会露出边缘
    const getBoundaries = useCallback(() => {
        const vh = window.innerHeight;
        const vw = window.innerWidth;

        // 计算缩放后的实际图片尺寸 (以最上层或基准层为例)
        // 注意：这里要考虑 scale 对边界的影响
        const scaledW = CONTENT_SIZE.width * currentScale;
        const scaledH = CONTENT_SIZE.height * currentScale;

        // 最大速度系数，用于计算位移极限
        const maxSpeed = SPEEDS.flower2;

        // 允许滑动的物理像素半径
        // 逻辑：(图片缩放后的宽度 - 视口宽度) / 2 / 速度系数
        // 除以速度系数是因为我们要控制的是基础 offset，而实际位移是 offset * speed
        const limitX = Math.max(0, (scaledW - vw) / 2 / maxSpeed);
        const limitY = Math.max(0, (scaledH - vh) / 2 / maxSpeed);

        return { limitX, limitY };
    }, [currentScale]);

    // 辅助函数：限制数值在范围内
    const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    // 更新 Offset 并应用边界限制
    // const updateOffset = useCallback((newX: number, newY: number) => {
    //     const { limitX, limitY } = getBoundaries();
    //     setOffset({
    //         x: clamp(newX, -limitX, limitX),
    //         y: clamp(newY, -limitY, limitY)
    //     });
    // }, [getBoundaries]);

    // 惯性动画逻辑
    const animate = useCallback(() => {
        if (!isDragging.current) {
            if (Math.abs(velocity.current.x) > 0.01 || Math.abs(velocity.current.y) > 0.01) {
                velocity.current.x *= 0.92; // 惯性衰减
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

    // 拖拽处理
    const handleStart = (clientX: number, clientY: number) => {
        isDragging.current = true;
        lastPos.current = { x: clientX, y: clientY };
        velocity.current = { x: 0, y: 0 };
    };

    // 修改 handleMove：应用速度倍率
    const handleMove = (clientX: number, clientY: number) => {
        if (!isDragging.current) return;

        // 核心修改：将鼠标位移乘以倍率
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

    // 在组件内部定义 handleZoom
    const handleZoom = (nextScale: number) => {
        if (nextScale === currentScale) return;

        const ratio = nextScale / currentScale;

        // 更新 offset，使得原本在视野中心的内容在缩放后依然在视野中心
        // 逻辑：如果图片放大了 1.2 倍，原本的位移也要相应放大，才能对准原来的点
        setOffset(prev => ({
            x: prev.x * ratio,
            y: prev.y * ratio
        }));

        setCurrentScale(nextScale);
    };

    const getLayerStyle = (layerName: keyof typeof SPEEDS): CSSProperties => {
        const speed = SPEEDS[layerName];
        const factor = SCALE_FACTORS[layerName];

        // 计算当前层的独立缩放值
        // 逻辑：以 1 为基准，根据用户选择的 currentScale 和该层的权重进行增减
        const layerScale = 1 + (currentScale - 1) * factor;

        return {
            // 关键：必须在同一个 transform 属性中同时写 translate 和 scale
            // 且 scale 放在 translate 后面通常视觉效果更稳
            transform: `translate(${offset.x * speed}px, ${offset.y * speed}px) scale(${layerScale})`,

            zIndex: Math.floor(speed * 100),
            transition: isDragging.current ? "none" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)",
            transformOrigin: "center center", // 确保每一层都绕中心点缩放
        };
    };

    useEffect(() => {
        // 每次缩放变化后，强制校验一次边界，防止缩放后露出黑边
        const { limitX, limitY } = getBoundaries();
        setOffset(prev => ({
            x: clamp(prev.x, -limitX, limitX),
            y: clamp(prev.y, -limitY, limitY)
        }));
    }, [currentScale, getBoundaries]);

    // const handleWheel = (e: React.WheelEvent) => {
    //     const delta = e.deltaY > 0 ? 0.9 : 1.1; // 缩放系数
    //     const nextScale = clamp(currentScale * delta, 0.8, 1.2);

    //     // 如果需要以鼠标为中心缩放，计算会更复杂：
    //     // 需要计算鼠标相对于容器中心的坐标，并对 offset 进行反向补偿
    //     handleZoom(nextScale);
    // };

    // 动态渲染图标的逻辑
    // 在 renderIcon 函数里
    const renderIcon = () => {
        const iconProps = { size: 20, color: "#ffffff" }; // 设置大小和颜色

        if (volume === 0) return <VolumeOff {...iconProps} />;
        if (volume < 0.3) return <Volume {...iconProps} />;
        if (volume < 0.7) return <Volume1 {...iconProps} />;
        return <Volume2 {...iconProps} />;
    };

    return (
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
            <div className="control-buttons">
                {/* 1. 音量控制 (原有) */}
                <div className="control">

                    <div className="volume-container flex items-center gap-3">
                        {/* 点击图标可以快速静音/取消静音 */}
                        <div
                            className="icon cursor-pointer hover:text-blue-400 transition-colors"
                            onClick={() => adjustVolume(volume > 0 ? 0 : 0.5)}
                        >
                            {renderIcon()}
                        </div>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={handleChange}
                            className="slider w-24 accent-blue-500 cursor-pointer"
                        />
                        <span className="label text-xs font-mono w-8 text-white/80">
                            {Math.round(volume * 100)}%
                        </span>
                    </div>
                </div>

                {/* 2. 缩放控制 (原有) */}
                <div className="control">
                    {SCALE_OPTIONS.map((s) => (
                        <button key={s} className={currentScale === s ? "active" : ""} onClick={(e) => { e.stopPropagation(); handleZoom(s); }}>
                            {s * 100}%
                        </button>
                    ))}
                </div>

                <div className="control">
                    {/* Home 按钮 */}
                    <button
                        className="p-2 flex items-center justify-center hover:bg-white/20 transition-colors"
                        onClick={(e) => { e.stopPropagation(); startTransition("/") }}
                        title="回到中心"
                    >
                        <Home size={20} color="#ffffff" />
                    </button>
                </div>

                <div className="control">
                    {/* 速度倍率切换按钮 */}
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
                <div className="layer ui-layer" style={getLayerStyle('ui')}>
                    {/* UI 绝对定位元素放置区 */}
                    <div
                        style={{
                            position: "absolute", // 顶层容器相对定位
                            left: 0,
                            top: 0,
                            zIndex: 2,
                            width: 1000,          // 容器宽高可根据需要调整
                            height: 1000,          // 比如这里容器就足够包住所有按钮
                            // border: "1px solid gray", // 可选，方便调试
                        }}
                    >
                        <div style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}>
                            <MiniDiamondButton bg={1} size={80} onClick={() => console.log("clicked")}>
                                1-25
                            </MiniDiamondButton>
                        </div>
                        <div style={{ position: "absolute", left: 200, top: 0, zIndex: 2 }}>
                            <MiniDiamondButton bg={1} size={80} onClick={() => console.log("clicked")}>
                                2-23
                            </MiniDiamondButton>
                        </div>
                        <div style={{ position: "absolute", left: 400, top: -200, zIndex: 2 }}>
                            <MiniDiamondButton bg={1} size={80} onClick={() => console.log("clicked")}>
                                2-28
                            </MiniDiamondButton>
                        </div>
                        <div style={{ position: "absolute", left: 400, top: 200, zIndex: 2 }}>
                            <MiniDiamondButton bg={2} size={80} onClick={() => console.log("clicked")}>
                                3-12
                            </MiniDiamondButton>
                        </div>
                        {/* 两两连线 */}
                        <Line start={{ x: 0 + 40, y: 0 + 40 }} end={{ x: 200 + 40, y: 0 + 40 }} />
                        <Line start={{ x: 0 + 40, y: 0 + 40 }} end={{ x: 400 + 40, y: 200 + 40 }} />
                        <Line start={{ x: 200 + 40, y: 0 + 40 }} end={{ x: 400 + 40, y: 200 + 40 }} />
                        <Line start={{ x: 200 + 40, y: 0 + 40 }} end={{ x: 400 + 40, y: -200 + 40 }} />
                        <Line start={{ x: 400 + 40, y: 200 + 40 }} end={{ x: 400 + 40, y: -200 + 40 }} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParallaxMap;