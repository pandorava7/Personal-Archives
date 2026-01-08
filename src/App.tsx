import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import "./App.css";
import { ASSET_BASE_URL } from "./config/assets";
import { useTranslation } from "react-i18next";
import DiamondButton from "./components/DiamondButton/DiamondButton";
import LanguageSwitcher from "./components/LanguageSwitcher/LanguageSwitcher";
import SceneTransition from "./components/SceneTransition/SceneTransition";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import ParallaxMap from "./pages/ParallaxMap/ParallaxMap";
import Home from "./pages/Home/Home";
import CurrencyConverter from "./pages/Tools/CurrencyConverter/CurrencyConverter";
import HabitTracker from "./pages/Tools/HabitTracker/HabitTracker";
import WheelPage from "./pages/Tools/WheelPage/WheelPage";
import BlogPage from "./pages/BlogPage/BlogPage";
import PostDetail from "./pages/PostDetail/PostDetail";

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

// 定义用户数据的类型
export interface UserData {
  name: string;
  avatarUrl: string;
  role?: string; // 可选属性，比如管理员、博主
  level?: number;
}

const App: React.FC = () => {
  const [entered, setEntered] = useState<boolean>(() => {
    return sessionStorage.getItem("entered") === "true";
  });

  const initialVideoRef = useRef<HTMLVideoElement>(null);
  const mainVideoRef = useRef<HTMLVideoElement>(null);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isWorld = location.pathname === "/world";
  const isBlog = location.pathname === "/blog";
  const isLinks = location.pathname === "/links";
  // 判断逻辑：如果不是首页，或者已经是进入状态(entered)，则显示导航栏
  const shouldShowNavbar = entered && (!isWorld && !isHome);
  const DEFAULT_USER: UserData = {
    name: "Guest User",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix", // 随机头像 API
  };
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
          <Route path="/world" element={<ParallaxMap />} />
          <Route path="/cc" element={<CurrencyConverter />} />
          <Route path="/wheel" element={<WheelPage />} />
          <Route path="/habit" element={<HabitTracker />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/post/:id" element={<PostDetailWrapper />} />
          <Route path="/links" element={<FriendLink />} />
        </Routes>

        {/* 只有在满足条件时才渲染 Navbar */}
        {shouldShowNavbar && <Navbar user={DEFAULT_USER} />}
      </TransitionContext.Provider>

      {/* 场景层：通过 CSS 隐藏或 key 切换 */}
      {isHome && !entered && (
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

                <LanguageSwitcher direction="right" arrange="up" />
              </div>
            </div>

          </div>
        </div>
      )}


    </div>
  );
};

// 辅助组件：从 URL 中提取 ID 并传给 PostDetail
import { useParams } from 'react-router-dom';
import Navbar from "./components/Navbar/Navbar";
import FriendLink from "./pages/FriendLink/FriendLink";
const PostDetailWrapper = () => {
  const { id } = useParams<{ id: string }>();
  return <PostDetail postId={id || ''} />;
};

export default App;
