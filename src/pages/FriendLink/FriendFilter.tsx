interface FilterProps {
  categories: string[];
  nowCategory: string;
  onChange: (c: string) => void;
  search: string;
  onSearch: (s: string) => void;
  onRandom: () => void;
}

export default function FriendFilter({ categories, nowCategory, onChange, search, onSearch, onRandom }: FilterProps) {
  return (
    <div className="fl-controls">
      <input
        className="fl-search"
        placeholder="搜索站点 / 标签..."
        value={search}
        onChange={e => onSearch(e.target.value)}
      />
      <select
        className="fl-select"
        value={nowCategory}
        onChange={e => onChange(e.target.value)}
      >
        <option value="all">全部分类</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button className="fl-random" onClick={onRandom}>随机访问</button>
    </div>
  );
}
