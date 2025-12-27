import { useRef, useState, useEffect } from "react";
import "./ParallaxMap.css";
import Flower1 from "@/assets/images/layer/act2_flower1.png";
import Flower2 from "@/assets/images/layer/act2_flower2.png";
import Shards1 from "@/assets/images/layer/act2_shards1.png";
import Shards2 from "@/assets/images/layer/act2_shards2.png";
import World from "@/assets/images/layer/world2.jpg";
// import DiamondButton from "../../components/DiamondButton/DiamondButton";
import MiniDiamondButton from "../../components/MiniDiamondButton/MiniDiamondButton";
import Line from "../../components/Line/Line";
import { useSceneTransition } from "../../App";
import { playClick, playHover } from "../../utils/sfx";
import { useTranslation } from "react-i18next";

export default function ParallaxMap() {

    const { t } = useTranslation();

    const desktopInitialPos = { x: 0, y: -6000 };
    const mobileInitialPos = { x: -650, y: -6000 };
    const isTouchDevice =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0;

    const [pos, setPos] = useState(isTouchDevice ? mobileInitialPos : desktopInitialPos);
    const [dragSpeedIndex, setDragSpeedIndex] = useState(3); // 初始为 2.0
    const velocity = useRef({ x: 0, y: 0 });
    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    const screenWidth = window.innerWidth;

    const speedOptions = [0.5, 1, 2, 4, 8];
    const dragSpeeds = speedOptions;

    const desktopWidth = 1536;
    const mobileWidth = 390;

    const desktopDrag = 0.4;
    const desktopWorldWidth = 6100;
    const desktopWorldHeight = 13000;

    const mobileDrag = 1;
    const mobileWorldWidth = 16000;
    const mobileWorldHeight = 14000;

    // 线性插值
    const drag_multiplier_base = desktopDrag +
        (screenWidth - desktopWidth) / (mobileWidth - desktopWidth) * (mobileDrag - desktopDrag);
    const drag_multiplier = drag_multiplier_base * dragSpeeds[dragSpeedIndex];

    const worldWidth = desktopWorldWidth +
        (screenWidth - desktopWidth) / (mobileWidth - desktopWidth) * (mobileWorldWidth - desktopWorldWidth);
    const worldHeight = desktopWorldHeight +
        (screenWidth - desktopWidth) / (mobileWidth - desktopWidth) * (mobileWorldHeight - desktopWorldHeight);

    const clamp = (value: number, min: number, max: number) =>
        Math.max(min, Math.min(value, max));

    const drag_multiplier_final = clamp(drag_multiplier, desktopDrag, mobileDrag * 2); // 放宽上限
    const worldWidth_final = clamp(worldWidth, desktopWorldWidth, mobileWorldWidth);
    const worldHeight_final = clamp(worldHeight, desktopWorldHeight, mobileWorldHeight);

    const minX = window.innerWidth - worldWidth_final;
    const maxX = 0;
    const minY = window.innerHeight - worldHeight_final;
    const maxY = 0;

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "";
        };
    }, []);

    const onDown = (e: React.PointerEvent) => {
        e.preventDefault();
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    };

    const onMove = (e: React.PointerEvent) => {
        if (!dragging.current) return;
        const dx = e.clientX - last.current.x;
        const dy = e.clientY - last.current.y;

        setPos(p => ({
            x: clamp(p.x + dx * drag_multiplier_final, minX, maxX),
            y: clamp(p.y + dy * drag_multiplier_final, minY, maxY)
        }));

        velocity.current = { x: dx * drag_multiplier_final, y: dy * drag_multiplier_final };
        last.current = { x: e.clientX, y: e.clientY };
    };

    const onUp = () => {
        dragging.current = false;
        requestAnimationFrame(inertiaStep);
    };

    const inertiaStep = () => {
        if (dragging.current) return;

        velocity.current.x *= 0.95;
        velocity.current.y *= 0.95;

        setPos(p => {
            let newX = clamp(p.x + velocity.current.x, minX, maxX);
            let newY = clamp(p.y + velocity.current.y, minY, maxY);

            if (newX === minX || newX === maxX) velocity.current.x = 0;
            if (newY === minY || newY === maxY) velocity.current.y = 0;

            return { x: newX, y: newY };
        });

        if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
            requestAnimationFrame(inertiaStep);
        }
    };

    const toggleSpeed = () => {
        setDragSpeedIndex((prev) => (prev + 1) % dragSpeeds.length);
    };


    const { startTransition } = useSceneTransition();

    return (
        <div
            className="viewport"
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerLeave={onUp}
        >
            {/* 左上角固定按钮 */}
            <button className="button transparent-shadow"
                onMouseEnter={playHover} onClick={() => {
                    playClick();
                    toggleSpeed();
                }}
                style={{
                    position: "fixed",
                    left: 20,
                    top: 20,
                    zIndex: 999,
                    padding: "8px 12px",
                    fontSize: "16px",
                    color: "white",

                }}
            >
                {dragSpeeds[dragSpeedIndex].toFixed(1)}
            </button>
            <button className="button transparent-shadow"
                onMouseEnter={playHover} onClick={() => {
                    playClick();
                    startTransition("/", {
                        onMid: () => {
                            console.log("现在是黑屏，可以切页面");
                        },
                        onDone: () => {
                            console.log("转场完成");
                        },
                    })
                }}
                style={{
                    position: "fixed",
                    left: 100,
                    top: 20,
                    zIndex: 999,
                    padding: "8px 12px",
                    fontSize: "16px",
                    color: "white",

                }}>
                {t("world.button.menu")}
            </button>
            <div className="world">
                <img
                    className="layer world-layer"
                    src={World}
                    style={{ transform: `translate(${pos.x * 0.1}px, ${pos.y * 0.1}px)` }}
                />
                <img
                    className="layer flower1-layer"
                    src={Flower1}
                    style={{
                        transform: `translate(${pos.x * 0.12}px, ${pos.y * 0.12}px)`,
                        position: "absolute", left: 200, top: 0
                    }}
                />
                <img
                    className="layer shards1-layer"
                    src={Shards1}
                    style={{
                        transform: `translate(${pos.x * 0.14}px, ${pos.y * 0.125}px)`,
                        position: "absolute", left: 100, top: 1000
                    }}
                />
                <img
                    className="layer shards2-layer"
                    src={Shards2}
                    style={{
                        transform: `translate(${pos.x * 0.15}px, ${pos.y * 0.14}px)`,
                        position: "absolute", left: 100, top: 1200
                    }}
                />
                <img
                    className="layer flower2-layer"
                    src={Flower2}
                    style={{
                        transform: `translate(${pos.x * 0.16}px, ${pos.y * 0.16}px)`,
                        position: "absolute", left: 300, top: 0
                    }}
                />



                {/* 顶层自由内容 */}
                <div
                    className="ui"
                    style={{ transform: `translate(${pos.x * 0.5}px, ${pos.y * 0.5}px)` }}
                >
                    <div
                        style={{
                            position: "absolute", // 顶层容器相对定位
                            left: 500,
                            top: 3300,
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

                    <div
                        style={{
                            position: "absolute", // 顶层容器相对定位
                            left: 1500,
                            top: 3300,
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

            <footer className="text-shadow">
                {t("world.info")}
            </footer>
        </div>
    );
}
