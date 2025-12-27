// import React, { useEffect, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import { useFlashMessage } from "../FlashMessageContext/FlashMessageContext";
import MenuIcon from "./icons/menu.svg?react";
import "./MenuList.css";

const MenuList: React.FC = () => {

  
  const { addMessage } = useFlashMessage();

  return (
    <button
      className="hover-bounce button"
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
        addMessage({ text: "还没做这个功能嘞~", type: "warning" });
      }}
      aria-label="Menu List"
    >

      <MenuIcon className="icon" />
    </button>
  );
};

export default MenuList;
