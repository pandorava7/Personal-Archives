// MiniDiamondButton.tsx
import React from "react";
import styles from "./MiniDiamondButton.module.css";
// …根据需要导入所有图片
import img1 from '/src/assets/images/world-bg/1.png';
import img2 from '/src/assets/images/world-bg/2.png';

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
    const bgImages = [img1, img2];
    const bgUrl = bgImages[bg - 1];

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
