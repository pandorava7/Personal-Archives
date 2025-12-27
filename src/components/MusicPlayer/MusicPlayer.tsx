// import React, { useEffect, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import { useFlashMessage } from "../FlashMessageContext/FlashMessageContext";
import MusicIcon from "./icons/music.svg?react";
import "./MusicPlayer.css";

const MusicPlayer: React.FC = () => {

  const { addMessage } = useFlashMessage();

  return (
    <button
      className="hover-bounce button"
      onMouseEnter={playHover}
      onClick={() => {
        addMessage({ text: "还没做这个功能嘞~", type: "warning" });
        playClick();
      }}
      aria-label="Music Player"
    >

      <MusicIcon className="icon" />
    </button>
  );
};

export default MusicPlayer;
