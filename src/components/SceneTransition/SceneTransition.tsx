import { useEffect, useState } from "react";
import "./SceneTransition.css";
import { useTranslation } from "react-i18next";

interface SceneTransitionProps {
    active: boolean;
    duration?: number; // 伪加载时长
    onFinish?: () => void;
}

const SceneTransition: React.FC<SceneTransitionProps> = ({
    active,
    duration = 1500,
    onFinish,
}) => {
    const [isVisible, setIsVisible] = useState(true); // 控制组件是否在 DOM 中
    const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");

    // 加载随机短语
    const { t } = useTranslation();
    const [randomMessage, setRandomMessage] = useState("");

    useEffect(() => {

        if (active) {
            setIsVisible(true);
            setPhase("idle"); // 初始状态

            // 下一帧再触发 in
            requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setPhase("in");

                const loadingArray: string[] = t("common.loading", { returnObjects: true }) as string[];
                const message = loadingArray[Math.floor(Math.random() * loadingArray.length)];
                setRandomMessage(message); // <-- 更新 state
            });
        });

            const switchTimer = setTimeout(() => {
                onFinish?.();
            }, 800);

            const outTimer = setTimeout(() => {
                setPhase("out");
            }, duration);

            const removeTimer = setTimeout(() => {
                setIsVisible(false);
            }, duration + 800);

            return () => {
                clearTimeout(switchTimer);
                clearTimeout(outTimer);
                clearTimeout(removeTimer);
            };
        }
    }, [active, duration]);

    if (!isVisible) return null;

    return (
        <div className={`scene-transition-layer ${phase}`}>
            <div className={`triangle ${phase === "in" ? "slide-up-in" : phase === "out" ? "slide-up-out" : ""}`} />

            {/* 修改点：允许 phase 为 "out" 时依然渲染，但添加 exit 类名 */}
            {(phase === "in" || phase === "out") && (
                <div className={`loading-ui ${phase === "out" ? "exit" : ""}`}>

                    <p className="loading-text">{randomMessage}</p>
                    <div className="loading-bar-wrapper">
                        <div className="loading-bar" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default SceneTransition;
