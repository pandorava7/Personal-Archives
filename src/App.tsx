import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { ASSET_BASE_URL } from "./config/assets";
import { useTranslation } from "react-i18next";
import DiamondButton from "./components/DiamondButton/DiamondButton";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import SceneTransition from "./components/SceneTransition/SceneTransition";

const App: React.FC = () => {
  const [entered, setEntered] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  const initialVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("site.title");
  }, [i18n.language]);

  useEffect(() => {
    if (entered && mainVideoRef.current) {
      mainVideoRef.current
        .play()
        .catch(err => {
          console.warn("Main video play blocked:", err);
        });
      mainVideoRef.current!.muted = false;
    }
  }, [entered]);


  const handleEnter = () => {
    setShowTransition(true);
  };

  return (
    <div className="wrapper">
      {/* 场景层：通过 CSS 隐藏或 key 切换 */}
      {!entered ? (
        <div className="page-waiting">
          <video
            ref={initialVideoRef}
            key="waiting-video"
            loop
            autoPlay
            muted
            playsInline
            className="bg-fixed w-full h-full object-cover"
          >
            <source src={`${ASSET_BASE_URL}/media/waiting-page.mp4`} type="video/mp4" />
          </video>

          <div className="absolute z-10 flex flex-col items-center bottom-0 mb-10">
            <DiamondButton onClick={handleEnter}>{t("common.enter")}</DiamondButton>
            <LanguageSwitcher />
          </div>
        </div>
      ) : (
        <div className="page-main">
          {/* <video
            ref={mainVideoRef}
            key="main-video"
            loop
            autoPlay
            muted
            playsInline
            className="bg-fixed w-full h-full object-cover"
          >
            <source src={`${ASSET_BASE_URL}/media/vernal-reverie.mp4`} type="video/mp4" />
          </video> */}

          <img src={`${ASSET_BASE_URL}/media/伊蕾娜.jpg`} className="bg-fixed" alt="" />

          <div className="content absolute z-10 top-0 left-0 p-10 text-white">
            <h1>{t("common.welcome")}</h1>
            <p>{t("common.description")}</p>
          </div>
        </div>
      )}

      {/* 转场层：始终保持挂载，或者由内部 isVisible 控制 */}
      <SceneTransition
        active={showTransition}
        duration={1500}
        onFinish={() => setEntered(true)} // 中途切换，此时遮罩正处于全屏状态
      />
    </div>
  );
};

export default App;
