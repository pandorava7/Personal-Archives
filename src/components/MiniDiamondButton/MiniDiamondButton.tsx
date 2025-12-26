// MiniDiamondButton.tsx
import React from "react";
import styles from "./MiniDiamondButton.module.css";

interface MiniDiamondButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  bg?: number; // 背景图编号
  size?: number; // 按钮宽高，单位px
  _className?: string;
}

const MiniDiamondButton: React.FC<MiniDiamondButtonProps> = ({
  onClick,
  children,
  bg = 1,
  size = 100,
  _className,
}) => {
  const bgUrl = `/src/assets/images/world-bg/${bg}.png`;

  return (
    <button
      className={`${styles.diamondButton} ${_className}`}
      onClick={onClick}
      style={{ width: size, height: size, backgroundImage: `url(${bgUrl})` }}
    >
      <span className={styles.diamondContent}>{children}</span>
    </button>
  );
};

export default MiniDiamondButton;
