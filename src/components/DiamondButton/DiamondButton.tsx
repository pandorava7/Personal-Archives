import React from "react";
import styles from "./DiamondButton.module.css";

// 预先导入图片
import img1 from "/src/assets/images/diamond_button/1.png";
import img2 from "/src/assets/images/diamond_button/2.png";
import img3 from "/src/assets/images/diamond_button/3.avif";
import { playClick, playHover } from "../../utils/sfx";
// 需要更多就继续加

const bgImages = [img1, img2, img3];

interface DiamondButtonProps {
  onClick?: () => void;
  children?: React.ReactNode;
  bg?: number; // 从 1 开始
  _className?: string;
  width?: number | string;  // 新增宽度
  height?: number | string; // 新增高度
}

const DiamondButton: React.FC<DiamondButtonProps> = ({
  onClick,
  children,
  bg = 1,
  _className,
  width = 150,  // 默认 150px
  height = 150, // 默认 150px
}) => {
  const bgUrl = bgImages[bg - 1];

  return (
    <button
      onMouseEnter={playHover}
      onClick={() => {
        playClick();      // 播放点击音效
        if (onClick) onClick();  // 调用用户传入的回调
      }}
      className={`${styles.diamondButton} ${_className ?? ""}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
      }}
    >
      <span className={styles.diamondContent}>{children}</span>
    </button>

  );
};

export default DiamondButton;
