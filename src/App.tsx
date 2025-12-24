import React from "react";
import "./App.css";

const App: React.FC = () => {
  return (
    <div className="App">
      {/* <div className="video-container">
        <iframe
          src="https://www.youtube.com/embed/UYIeOTV3z4E?autoplay=1&mute=1&loop=1&playlist=UYIeOTV3z4E"
          title="背景视频"
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      </div> */}
      <video autoPlay loop controls={false} muted={false} className="bg-video">
        <source src="/videos/myvideo.mp4" type="video/mp4" />
      </video>

      <div className="content">
        <h1>欢迎访问我的新网站！</h1>
        <p>我刚刚买了这个域名，随便看看吧 😄</p>
        <div className="buttons">
          <a
            href="https://github.com/你的用户名"
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            GitHub
          </a>
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
          >
            摆美的
          </a>
        </div>
      </div>
    </div>
  );
};

export default App;
