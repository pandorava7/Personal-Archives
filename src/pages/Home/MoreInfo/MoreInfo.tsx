// Home.tsx
import React from 'react';
import './MoreInfo.css';
// import { useTranslation } from 'react-i18next';
// import { useSceneTransition } from '../../../App';
import DiamondButton from '../../../components/DiamondButton/DiamondButton';
import Image1 from "@/assets/images/minecraft/2.avif";
import Image2 from "@/assets/images/minecraft/3.avif";
import Image3 from "@/assets/images/minecraft/4.avif";
import { useFlashMessage } from '../../../components/FlashMessageContext/FlashMessageContext';


const MoreInfo: React.FC = () => {
  // const { t } = useTranslation();
  // const { startTransition } = useSceneTransition();
  const { addMessage } = useFlashMessage();

  return (
    <div className="moreinfo-container">
      <div className='section minecraft'>
        <DiamondButton
          bg={3}
          _className="-rotate-90"
          onClick={() => {
            addMessage({ text: "还没做这个功能嘞~", type: "warning" });

            // startTransition("/map", {
            //   onMid: () => {
            //     console.log("现在是黑屏，可以切页面");
            //   },
            //   onDone: () => {
            //     console.log("转场完成");
            //   },
            // })
          }
          }
        ></DiamondButton>

        <div className='info-area'>
          <h1 className='text-shadow'>Minecraft 服务器永久开放</h1>
          <div className='images'>
            <div className='item'>
              <img className='box-sahdow' src={Image1} alt="" />
              <p>自由建造</p>
            </div>
            <div className='item'>
              <img src={Image2} alt="" />
              <p>休闲养老</p>
            </div>
            <div className='item'>
              <img src={Image3} alt="" />
              <p>朋友服</p>
            </div>
          </div>

        </div>

      </div>
    </div>

  )
}

export default MoreInfo;
