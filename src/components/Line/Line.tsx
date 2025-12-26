// import React, { useEffect, useState } from "react";

interface LineProps {
  start: { x: number; y: number }; // 起点中心坐标
  end: { x: number; y: number };   // 终点中心坐标
}

const Line: React.FC<LineProps> = ({ start, end }) => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const length = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

  return (
    <div
      style={{
        position: "absolute",
        left: start.x,
        top: start.y,
        width: length,
        height: 2, // 线宽
        backgroundColor: "white",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "0 0",
        zIndex: 1, // 在线条在按钮下方
      }}
    />
  );
};

export default Line;
