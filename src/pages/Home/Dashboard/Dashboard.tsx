// Home.tsx
import React from 'react';
import './Dashboard.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../components/LanguageSwitcher/LanguageSwitcher';
import UserAvatar from "@/assets/images/your-avatar.jpg"
import Avatar from "@/assets/images/me-avatar.jpg"
import ThemeSwitcher from '../../../components/ThemeSwitcher/ThemeSwitcher';
import MusicPlayer from '../../../components/MusicPlayer/MusicPlayer';
import MenuList from '../../../components/MenuList/MenuList';
import { ASSET_BASE_URL } from '../../../config/assets';
import TimeDisplay from '../../../components/TimeDisplay/TimeDisplay';
import BriefCaseIcon from "../icons/briefcase.svg?react";
import GithubIcon from "../icons/github.svg?react";
import SearchIcon from "../icons/search.svg?react";
import ArchiveIcon from "../icons/archive.svg?react";
import ProjectIcon from "../icons/project.svg?react";
import AboutIcon from "../icons/about.svg?react";
import DriveIcon from "../icons/drive.svg?react";
import WeatherDisplay from '../../../components/WeatherDisplay/WeatherDisplay';
import { playClick, playHover } from '../../../utils/sfx';




const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className='home-container w-full box-shadow-lg'>

      {/* 左上角头像（绝对定位） */}
      <div className='account-area'>
        <img className='w-15 h-15' src={UserAvatar} alt="avatar" />
        <p>{t("common.username")}</p>
      </div>


      {/* 右侧往下排列的功能按钮（绝对定位） */}
      <div className="function-area z-10">
        <ThemeSwitcher />
        <LanguageSwitcher direction="left" arrange='down' />
        <MusicPlayer />
        <MenuList />
      </div>


      {/* 中间的核心内容 */}
      <div className='content-area'>
        {/* 角色 */}
        <div className='home-character'>
          <img src={`${ASSET_BASE_URL}/media/character/shiro/shiro_character.png`} alt="" />
        </div>

        <div className='media-box'>
          {/* 个人 */}
          <div className='personal-area'>
            <div className='brand'>
              <div className='title-1-bg'>
                <p className='title-1'>潘多拉</p>
              </div>
              <p className='title-2'>的</p>
              <p className='title-3 text-shadow'>档案馆</p>
              <img className='brand-logo' src={`${ASSET_BASE_URL}/media/brand.png`} alt="brand logo" />
            </div>

            <div className='time-area'>
              <div className='absolute'>

                <WeatherDisplay />
              </div>
              <TimeDisplay />
            </div>

            <div className='box rd-infinity flex gap-5 items-center'>
              <img className='rd-infinity w-25 h-25' src={Avatar} alt="avatar" />
              <div className='h-full flex flex-col justify-between w-full pr-5'>
                <p className='text-xl'>一名热爱创作的开发者</p>
                <div className='flex justify-end gap-5'>
                  <div className='scroll-button relative button rd-infinity flex flex-row justify-end overflow-hidden w-auto'
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                    <p className='absolute right-15'>职业</p>
                    <BriefCaseIcon className='icon'/>
                  </div>
                  <div className='button'
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                    <GithubIcon className='icon'/>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex flex-row justify-between gap-3'>
              <div className="box-button search-bar box rd-infinity w-7/10 pr-2 flex flex-row items-center">
                <input
                  type="text"
                  placeholder="搜索内容"
                  className="flex-1 bg-transparent outline-none text-sm"
                />
                <SearchIcon className="icon" />
              </div>
              <div className='box-button write-article box rd-infinity w-3/10 text-center text-xl'
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                写文章
              </div>
            </div>

            <div className='general-area box rd-large'>
              <p className='text-shadow-sm'>常规</p>
              <div className="list w-2/2">
                <div className="item archive"
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                  <ArchiveIcon className="icon" />
                  <p>我的收藏</p>
                </div>
                <div className="item project"
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                  <ProjectIcon className="icon" />
                  <p>我的项目</p>
                </div>
                <div className="item about"
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                  <AboutIcon className="icon" />
                  <p>关于网站</p>
                </div>
                <div className="item drive"
                      onMouseEnter={playHover} onClick={() => { playClick(); }}>
                  <DriveIcon className="icon" />
                  <p>网盘</p>
                </div>
              </div>

              {/* <div className='w-1/2'>

              </div> */}
            </div>
          </div>


          {/* 工具箱 */}
          <div className='tools-area relative'>
            <p className='gradient-text text-2xl'>工具箱</p>
            <div className='box rd-large'>
              <div className="box rd-medium"></div>
              <div className="box rd-medium"></div>
              <div className="box rd-medium"></div>
              <div className="box rd-medium"></div>
              <div className="box rd-medium"></div>
              <div className="box rd-medium"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

export default Dashboard;
