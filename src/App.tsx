import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { ASSET_BASE_URL } from "./config/assets";
import { useTranslation } from "react-i18next";
import DiamondButton from "./components/DiamondButton/DiamondButton";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";

const App: React.FC = () => {
  const [entered, setEntered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnter = async () => {
    setEntered(true);

    // 等待 DOM 渲染完成再播放
    setTimeout(() => {
      videoRef.current?.play();
    }, 0);
  };

  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.title = t("site.title");
  }, [i18n.language]);

  // 初始页面
  if (!entered) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center">
        <video
          ref={videoRef}
          loop
          autoPlay
          controls={false}
          muted={true}
          playsInline
          className="bg-video"
        >
          <source src={`${ASSET_BASE_URL}/media/waiting-page.mp4`} type="video/mp4" />
        </video>
        <div className="absolute z-10 flex flex-col items-center bottom-0">
          <DiamondButton onClick={handleEnter} _className="">
            {t("common.enter")}
          </DiamondButton>
          <LanguageSwitcher />
        </div>

      </div>
    );
  }

  // 正式页面
  return (
    <div className="App">
      <video
        ref={videoRef}
        loop
        controls={false}
        muted={false}
        playsInline
        className="bg-video"
      >
        <source src={`${ASSET_BASE_URL}/media/MV.mp4`} type="video/mp4" />
      </video>

      <div className="content">
        <h1>{t("common.welcome")}</h1>
        <p>{t("common.description")}</p>
      </div>
    </div>
  );
};

export default App;
