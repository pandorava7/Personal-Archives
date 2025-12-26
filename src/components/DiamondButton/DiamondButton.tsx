import React from "react";
import styles from "./DiamondButton.module.css";

// 预先导入图片
import img1 from "/src/assets/images/diamond_button/1.png";
import img2 from "/src/assets/images/diamond_button/2.png";
// 需要更多就继续加

const bgImages = [img1, img2];

interface DiamondButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  bg?: number; // 从 1 开始
  _className?: string;
}

const DiamondButton: React.FC<DiamondButtonProps> = ({
  onClick,
  children,
  bg = 1,
  _className,
}) => {
  const bgUrl = bgImages[bg - 1];

  return (
    <button
      className={`${styles.diamondButton} ${_className ?? ""}`}
      onClick={onClick}
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
      }}
    >
      <span className={styles.diamondContent}>{children}</span>
    </button>
  );
};

export default DiamondButton;
