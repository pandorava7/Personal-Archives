import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from "react-i18next";
import { playHover, playClick } from "../../utils/sfx";
import styles from './Navbar.module.css';

// 导入你的图标 (按你之前的路径)
import MoonIcon from "./icons/moon.svg?react";
import SunIcon from "./icons/sun.svg?react";
import MusicIcon from "./icons/music.svg?react";
import MenuIcon from "./icons/menu.svg?react";
import CNIcon from "./icons/cn.svg?react";
import USIcon from "./icons/us.svg?react";
import JPIcon from "./icons/jp.svg?react";
import LanguageIcon from "./icons/language-svgrepo-com.svg?react";
import { useSceneTransition } from '../../App';

interface NavbarProps {
  user: {
    name: string;
    avatarUrl: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ user }) => {
  const { i18n } = useTranslation();
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLangOptions, setShowLangOptions] = useState(false); // 控制语言子菜单
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { startTransition } = useSceneTransition();

  // 统一的跳转处理
  const handleNav = (e: React.MouseEvent, path: string) => {
    // 核心：阻止默认跳转行为
    e.preventDefault();
    playClick();
    startTransition(path, { onMid: () => { }, onDone: () => { } });
  };

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setShowLangOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLang = (lang: string) => {
    playClick();
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    setShowLangOptions(false);
  };

  const isActive = (lang: string) => i18n.language === lang;

  return (
    <nav className={`${styles.navbar} ${isDark ? styles.darkNavbar : ''}`}>
      {/* 左侧：用户信息 */}
      <div className={styles.leftSection}>
        <img src={user.avatarUrl} alt="avatar" className={styles.avatar} />
        <span className={styles.userName}>{user.name}</span>
      </div>

      {/* 中间：CoolBeans 按钮 */}
      <div className={styles.centerMenu}>
        <a href="/" className={styles.navLink} onMouseEnter={playHover} onClick={(e) => handleNav(e, "/")}>首页</a>
        <a href="/blog" className={styles.navLink} onMouseEnter={playHover} onClick={(e) => handleNav(e, "/blog")}>博客</a>
        <a href="/world" className={styles.navLink} onMouseEnter={playHover} onClick={(e) => handleNav(e, "/world")}>世界</a>
        <a href="/links" className={styles.navLink} onMouseEnter={playHover} onClick={(e) => handleNav(e, "/links")}>友链</a>
      </div>

      {/* 右侧：集成设置 */}
      <div className={styles.rightSection} ref={dropdownRef}>
        <button
          className={styles.settingsTrigger}
          onClick={() => { playClick(); setIsDropdownOpen(!isDropdownOpen); }}
        >
          <MenuIcon className='icon' />
        </button>

        {isDropdownOpen && (
          <div className={`${styles.dropdown} ${isDark ? styles.darkDropdown : ''}`}>
            {/* 昼夜切换 */}
            <div className={styles.dropItem} onClick={() => { playClick(); setIsDark(!isDark); }}>
              {isDark ? <SunIcon className='icon' /> : <MoonIcon className='icon' />}
              <span>{isDark ? '浅色模式' : '深色模式'}</span>
            </div>

            {/* 语言切换 - 点击展开子选项 */}
            <div className={styles.langWrapper}>
              <div className={styles.dropItem} onClick={() => { playClick(); setShowLangOptions(!showLangOptions); }}>
                <LanguageIcon className='icon' />
                <span>切换语言</span>
              </div>

              {showLangOptions && (
                <div className={styles.langOptionsGrid}>
                  <button className={`${styles.langSubItem} ${isActive('zh') ? styles.activeLang : ''}`} onClick={() => changeLang('zh')}>
                    <CNIcon className='icon' />
                  </button>
                  <button className={`${styles.langSubItem} ${isActive('us') ? styles.activeLang : ''}`} onClick={() => changeLang('us')}>
                    <USIcon className='icon' />
                  </button>
                  <button className={`${styles.langSubItem} ${isActive('jp') ? styles.activeLang : ''}`} onClick={() => changeLang('jp')}>
                    <JPIcon className='icon' />
                  </button>
                </div>
              )}
            </div>

            {/* 音乐按钮 */}
            <div className={styles.dropItem} onClick={playClick}>
              <MusicIcon className='icon' />
              <span>背景音乐</span>
            </div>

            <div className={styles.dropItem}>
              <MenuIcon className='icon' />
              <span>菜单栏</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;