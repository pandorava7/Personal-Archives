import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import "./App.css";
import { ASSET_BASE_URL } from "./config/assets";
import { useTranslation } from "react-i18next";
import DiamondButton from "./components/DiamondButton/DiamondButton";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import SceneTransition from "./components/SceneTransition/SceneTransition";
import { Route, Routes, useNavigate } from "react-router-dom";
import ParallaxMap from "./pages/ParallaxMap/ParallaxMap";
import Home from "./pages/Home/Home";

export type TransitionOptions = {
  to: string;
  onMid?: () => void;
  onDone?: () => void;
};
export type TransitionAPI = {
  startTransition: (to: string, options?: Partial<TransitionOptions>) => void;
};
export const TransitionContext = createContext<TransitionAPI | null>(null);

export const useSceneTransition = () => {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("useSceneTransition must be used inside TransitionProvider");
  }
  return ctx;
};

const App: React.FC = () => {
  const [entered, setEntered] = useState<boolean>(() => {
    return sessionStorage.getItem("entered") === "true";
  });

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

  const [transition, setTransition] = useState<TransitionOptions | null>(null);
  const navigate = useNavigate();

  const startTransition = (to: string, options?: Partial<TransitionOptions>) => {
    setTransition({ to, ...options });
  };

  return (
    <div className="wrapper">
      <TransitionContext.Provider value={{ startTransition }}>
        <SceneTransition
          active={!!transition}
          duration={1500}
          onMid={() => {
            transition?.onMid?.();
            navigate(transition!.to);
          }}
          onFinish={() => {
            transition?.onDone?.();
            setTransition(null);
          }}
        />

        <Routes>
          <Route path="/" element={<Home entered={entered} />} />
          <Route path="/map" element={<ParallaxMap />} />
        </Routes>
      </TransitionContext.Provider>

      {/* 场景层：通过 CSS 隐藏或 key 切换 */}
      {!entered && (
        <div className="page-waiting w-screen h-screen overflow-y-hidden">
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
              <DiamondButton bg={1} _className="absolute -right-19 bottom-25"
                onClick={() =>
                  startTransition("/", {
                    onMid: () => {
                      setEntered(true);
                      sessionStorage.setItem("entered", "true");
                    },
                    onDone: () => {
                      console.log("转场完成");
                    },
                  })
                }
              >
                {t("common.enter")}
              </DiamondButton>

              <div className="adjust-in-enter-page absolute bottom-0">

                <LanguageSwitcher direction="left" arrange="up" />
              </div>
            </div>

          </div>
        </div>
      )}


    </div>
  );
};

export default App;
