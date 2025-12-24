// DiamondButton.tsx
import React from "react";
import styles from "./DiamondButton.module.css";

interface DiamondButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  _className?: string;
}

const DiamondButton: React.FC<DiamondButtonProps> = ({ onClick, children, _className }) => {
  return (
    <button className={`${styles.diamondButton} ${_className}`} onClick={onClick}>
      <span className={styles.diamondContent}>{children}</span>
    </button>
  );
};

export default DiamondButton;
