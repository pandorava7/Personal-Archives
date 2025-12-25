import React, { useEffect, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import MenuIcon from "./icons/menu.svg?react";
import "./MenuList.css";

const MenuList: React.FC = () => {

  return (
    <button
      className="hover-bounce button"
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
      }}
      aria-label="Menu List"
    >

      <MenuIcon className="icon" />
    </button>
  );
};

export default MenuList;
