import React, { useEffect, useRef, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import { useTranslation } from "react-i18next";
import CNIcon from "./icons/cn.svg?react";
import USIcon from "./icons/us.svg?react";
import JPIcon from "./icons/jp.svg?react";
import LanguageIcon from "./icons/language-svgrepo-com.svg?react";
import "./LanguageSwitcher.css";

interface LanguageSwitcherProps {
    direction?: "left" | "right"; // options的滑入方向以及options会位于按钮的哪里
    arrange?: "down" | "up"; // option的垂直排列方向
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ direction = "right", arrange = "up" }) => {
    const { i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const changeLang = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
        setOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isActive = (lang: string) => i18n.language === lang;

    return (
        <div>
            <div className="lang-switcher-container" ref={containerRef}>
                <button
                    className="lang-switcher-btn hover-bounce button"
                    onMouseEnter={playHover}
                    onClick={() => { playClick(); setOpen(!open); }}
                >
                    <LanguageIcon className="icon text-shadow" />
                </button>

                <div
                    className={`lang-options ${open ? "open" : ""} ${direction} ${arrange}`}
                >
                    <button
                        className={`button lang-option transparent-shadow ${isActive("zh") ? "active" : ""}`}
                        onMouseEnter={playHover}
                        onClick={() => { playClick(); changeLang("zh"); }}
                        disabled={isActive("zh")}
                    >
                        <CNIcon className="icon" />
                        中文
                    </button>
                    <button
                        className={`button lang-option transparent-shadow ${isActive("us") ? "active" : ""}`}
                        onMouseEnter={playHover}
                        onClick={() => { playClick(); changeLang("us"); }}
                        disabled={isActive("us")}
                    >
                        <USIcon className="icon" />
                        English
                    </button>
                    <button
                        className={`button lang-option transparent-shadow ${isActive("jp") ? "active" : ""}`}
                        onMouseEnter={playHover}
                        onClick={() => { playClick(); changeLang("jp"); }}
                        disabled={isActive("jp")}
                    >
                        <JPIcon className="icon" />
                        日本語
                    </button>
                </div>
            </div>
        </div>

    );
};

export default LanguageSwitcher;