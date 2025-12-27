// Home.tsx
import React from 'react';
import './Highlights.css';
import { useSceneTransition } from '../../../App';
import HighlightsVideo from "@/assets/videos/highlights.mp4"
import LeftImage from "@/assets/images/highlight/1.png"
import CenterImage from "@/assets/images/highlight/2.png"
import RightImage from "@/assets/images/highlight/3.png"
import DiamondButton from '../../../components/DiamondButton/DiamondButton';
import { playClick, playHover } from '../../../utils/sfx';
import { useTranslation } from 'react-i18next';

const Highlights: React.FC = () => {
  const { startTransition } = useSceneTransition();
  const { t } = useTranslation();

  return (
    <div className="highlight-container">
      <video
        className="bg-video"
        src={HighlightsVideo}
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="content">
        <h1 className='title2'>{t("highlight.title2")}</h1>
        <h1 className='title3 text-shadow'>{t("highlight.title2")}</h1>
        <div className='center-box'>
          <div className='description-area'>
            <p>{t("highlight.desc1")}</p>
            <p>{t("highlight.desc2")}</p>
            <p>{t("highlight.desc3")}</p>
            {/* <div className="normal-button transparent-shadow">
              <span className="button-text">记忆迴廊</span>
            </div> */}
            <div className='relative -top-30'>
              <DiamondButton
                bg={2}
                _className="absolute -right-7 top-65"
                height={20} width={140}
                onClick={() =>
                  startTransition("/map", {
                    onMid: () => {
                      console.log("现在是黑屏，可以切页面");
                    },
                    onDone: () => {
                      console.log("转场完成");
                    },
                  })

                }></DiamondButton>
              <DiamondButton
                bg={2}
                _className="absolute -right-15 top-55"
                width={20} height={80}
                onClick={() =>
                  startTransition("/map", {
                    onMid: () => {
                      console.log("现在是黑屏，可以切页面");
                    },
                    onDone: () => {
                      console.log("转场完成");
                    },
                  })

                }></DiamondButton>
              <DiamondButton
                bg={2}
                _className="absolute -right-12 top-37"
                width={90} height={90}
                onClick={() =>
                  startTransition("/map", {
                    onMid: () => {
                      console.log("现在是黑屏，可以切页面");
                    },
                    onDone: () => {
                      console.log("转场完成");
                    },
                  })

                }></DiamondButton>
            </div>

          </div>

          <div className="items">
            <div className="capsule" onMouseEnter={playHover}>
              <div className="capsule-inner">
                <div className="capsule-text">
                  <p className="desc">{t("highlight.item1_desc")}</p>
                  <div className="normal-button transparent-shadow"
                    onMouseEnter={playHover} onClick={() => { playClick(); }}>
                    <span className="button-text">{t("highlight.unlock_button")}</span>
                  </div>
                </div>
                <div className="capsule-image">
                  <img src={LeftImage} alt="" />
                </div>
              </div>
            </div>

            <div className="capsule" onMouseEnter={playHover}>
              <div className="capsule-inner">
                <div className="capsule-text">
                  <p className="desc">{t("highlight.item2_desc")}</p>
                  <div className="normal-button transparent-shadow"
                    onMouseEnter={playHover} onClick={() => { playClick(); }}>
                    <span className="button-text">{t("highlight.unlock_button")}</span>
                  </div>
                </div>
                <div className="capsule-image">
                  <img src={CenterImage} alt="" />
                </div>
              </div>
            </div>

            <div className="capsule" onMouseEnter={playHover}>
              <div className="capsule-inner">
                <div className="capsule-text">
                  <p className="desc">{t("highlight.item3_desc")}</p>
                  <div className="normal-button transparent-shadow"
                    onMouseEnter={playHover} onClick={() => { playClick(); }}>
                    <span className="button-text">{t("highlight.unlock_button")}</span>
                  </div>
                </div>
                <div className="capsule-image">
                  <img src={RightImage} alt="" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>

  )
}

export default Highlights;
