import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { ASSET_BASE_URL } from "./config/assets";
import { useTranslation } from "react-i18next";
import DiamondButton from "./components/DiamondButton/DiamondButton";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import SceneTransition from "./components/SceneTransition/SceneTransition";
import Home from "./pages/Home/Home";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ParallaxMap from "./pages/ParallaxMap/ParallaxMap";

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
        <div className="page-waiting w-screen h-screen">
          <video
            ref={initialVideoRef}
            key="waiting-video"
            loop
            autoPlay
            muted
            playsInline
            className="bg-fixed w-full object-cover"
          >
            <source src={`${ASSET_BASE_URL}/media/enter-page.mp4`} type="video/mp4" />
          </video>

          <div className="absolute z-10 flex flex-col items-center bottom-0 mb-10 w-full">
            <div className="relative">
              <DiamondButton onClick={handleEnter}>{t("common.enter")}</DiamondButton>
              <div className="adjust-in-enter-page absolute bottom-0">

                <LanguageSwitcher direction="right" arrange="up" />
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="page-main w-full ">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<ParallaxMap />} />
            </Routes>
          </BrowserRouter>
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
