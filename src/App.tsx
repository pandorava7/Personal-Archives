import { useEffect, useState } from 'react'
import './App.css'

interface MediaItem {
  id: string;        // 或 number，按你后端实际
  title: string;
  r2_key: string;
}

function App() {
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

useEffect(() => {
  fetch("/api/media")
    .then(res => res.json())
    .then(setMediaList)
}, [])

fetch("https://nodejs-serverless-function-express-wheat-xi.vercel.app/api/upload", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ content: "Hello World!" }),
});

return (
  <div>
    <p>The media count is: {mediaList.length}</p>
    {mediaList.map(item => (
      <img key={item.id} src={`/media/${item.r2_key}`} alt={item.title} />
    ))}
  </div>
)
}

export default App
