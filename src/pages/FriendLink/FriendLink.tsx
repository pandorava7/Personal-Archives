import { useState, useMemo } from "react";
import type { FriendLink } from "./types";
import FriendCard from "./FriendCard";
import FriendFilter from "./FriendFilter";
import "./FriendLink.css";

const mockData: FriendLink[] = [
  {
    name: "梦境档案馆",
    url: "https://example.com",
    avatar: "/avatars/a1.png",
    desc: "沉浸式脑洞记录与艺术创作",
    categories: ["艺术", "个人"],
    tags: ["原创", "绘画", "随笔"],
    status: "alive"
  },
  {
    name: "代码炼金术",
    url: "https://code.dev",
    avatar: "/avatars/a2.png",
    desc: "前后端、AI、技术博客",
    categories: ["技术"],
    tags: ["web", "后端", "AI"],
    status: "alive"
  },
];

export default function FriendLinks() {
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    mockData.forEach(i => i.categories.forEach(c => set.add(c)));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    return mockData.filter(i => {
      const matchCategory = category === "all" || i.categories.includes(category);
      const matchSearch = search === "" ||
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()));
      return matchCategory && matchSearch;
    });
  }, [category, search]);

  const handleOpen = (item: FriendLink) => {
    window.open(item.url, "_blank");
  };

  const handleRandom = () => {
    const alive = filtered.filter(i => i.status !== "dead");
    if (alive.length > 0) {
      const pick = alive[Math.floor(Math.random() * alive.length)];
      window.open(pick.url, "_blank");
    }
  };

  return (
    <div className="fl-container">
      <FriendFilter
        categories={categories}
        nowCategory={category}
        onChange={setCategory}
        search={search}
        onSearch={setSearch}
        onRandom={handleRandom}
      />
      <div className="fl-grid">
        {filtered.map(i => (
          <FriendCard key={i.url} item={i} onClick={handleOpen} />
        ))}
      </div>
    </div>
  );
}
