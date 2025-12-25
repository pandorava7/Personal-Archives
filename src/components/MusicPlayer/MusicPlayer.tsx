// import React, { useEffect, useState } from "react";
import { playHover, playClick } from "../../utils/sfx";
import MusicIcon from "./icons/music.svg?react";
import "./MusicPlayer.css";

const MusicPlayer: React.FC = () => {

  return (
    <button
      className="hover-bounce button"
      onMouseEnter={playHover}
      onClick={() => {
        playClick();
      }}
      aria-label="Music Player"
    >

      <MusicIcon className="icon" />
    </button>
  );
};

export default MusicPlayer;
