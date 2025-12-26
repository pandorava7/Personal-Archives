import { useEffect, useState } from "react";
import "./SceneTransition.css";
import { useTranslation } from "react-i18next";

interface SceneTransitionProps {
  active: boolean;
  duration?: number;
  onMid?: () => void;
  onFinish?: () => void;
}

const SceneTransition: React.FC<SceneTransitionProps> = ({
    active,
    duration = 1500,
    onMid,
    onFinish,
}) => {
    const IN_DURATION = 800; // slide-up-in 的 CSS 时长
    const [isVisible, setIsVisible] = useState(true); // 控制组件是否在 DOM 中
    const [phase, setPhase] = useState<"idle" | "in" | "out">("idle");

    // 加载随机短语
    const { t } = useTranslation();
    const [randomMessage, setRandomMessage] = useState("");

    useEffect(() => {
  if (!active) return;

  setIsVisible(true);
  setPhase("idle");

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setPhase("in");

      const loadingArray = t("common.loading", { returnObjects: true }) as string[];
      setRandomMessage(
        loadingArray[Math.floor(Math.random() * loadingArray.length)]
      );
    });
  });

  // ✅ onMid：遮罩完全盖住
  const midTimer = setTimeout(() => {
    onMid?.();
  }, IN_DURATION);

  // 开始 out
  const outTimer = setTimeout(() => {
    setPhase("out");
  }, duration);

  // ✅ onFinish：整个转场结束
  const finishTimer = setTimeout(() => {
    onFinish?.();
    setIsVisible(false);
  }, duration + IN_DURATION);

  return () => {
    clearTimeout(midTimer);
    clearTimeout(outTimer);
    clearTimeout(finishTimer);
  };
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
