import type{ FriendLink } from "./types";

interface Props {
  item: FriendLink;
  onClick?: (item: FriendLink) => void;
}

export default function FriendCard({ item, onClick }: Props) {
  return (
    <div className={`fl-card ${item.status === "dead" ? "fl-dead" : ""}`} onClick={() => onClick?.(item)}>
      <img src={item.avatar} className="fl-avatar" alt={item.name} />
      <div className="fl-info">
        <div className="fl-title">{item.name}</div>
        <div className="fl-desc">{item.desc}</div>
      </div>
      <div className="fl-tags">
        {item.tags?.map(t => (
          <span key={t} className="fl-tag">{t}</span>
        ))}
      </div>
    </div>
  );
}
