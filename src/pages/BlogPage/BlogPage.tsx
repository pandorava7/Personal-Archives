import React, { useState, useEffect, useRef, useMemo } from 'react';
import styles from './BlogPage.module.css';
import { Folder, Clock, Hash, X, Coffee, BookOpen, Tag } from 'lucide-react';
import { ASSET_BASE_URL } from '../../config/assets';
import { useBlogData } from './useBlogData';
import { useNavigate } from 'react-router-dom';
import BilibiliIcon from './icons/bilibili.svg?react'
import XIcon from './icons/x.svg?react'

// 定义接口
export interface BlogPost {
  id: string;
  title: string;
  date: string;
  category: string;
  tags: string[];
  cover: string;
  summary: string;
  content_plain: string; // 用于搜索
}

const BlogPage: React.FC = () => {
  // --- [新增 1] 高亮文本组件 ---
  // 作用：将 text 中的 highlight 关键词拆分并包裹 span
  const HighlightText = ({ text, highlight }: { text: string; highlight: string }) => {
    if (!highlight.trim()) return <>{text}</>;

    // 使用正则表达式拆分，(gi) 表示全局+忽略大小写，且保留分隔符
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className={styles.highlightText}>{part}</span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  // --- [新增 2] 获取智能摘要逻辑 ---
  // 作用：决定是显示原摘要，还是从正文中截取一段包含关键词的内容
  const getSearchSnippet = (post: BlogPost, query: string) => {
    if (!query.trim()) return post.summary;

    const lowerQuery = query.toLowerCase();
    const lowerTitle = post.title.toLowerCase();
    const lowerSummary = post.summary.toLowerCase();
    const lowerContent = post.content_plain.toLowerCase();

    // 优先级 1: 如果标题或摘要里包含了关键词，直接显示带高亮的摘要即可
    // (也可以选择如果摘要没匹配但正文匹配了，依然优先显示正文片段，看你喜好。这里保持原摘要优先)
    if (lowerTitle.includes(lowerQuery) || lowerSummary.includes(lowerQuery)) {
      return <HighlightText text={post.summary} highlight={query} />;
    }

    // 优先级 2: 如果只有正文里有关键词 -> 截取上下文
    const matchIndex = lowerContent.indexOf(lowerQuery);
    if (matchIndex !== -1) {
      // 截取逻辑：关键词前面取 30 字，后面取 50 字
      const start = Math.max(0, matchIndex - 30);
      const end = Math.min(post.content_plain.length, matchIndex + query.length + 50);

      let snippet = post.content_plain.slice(start, end);

      // 如果不是从头开始，前面加省略号
      if (start > 0) snippet = '...' + snippet;
      // 如果没到结尾，后面加省略号
      if (end < post.content_plain.length) snippet = snippet + '...';

      return <HighlightText text={snippet} highlight={query} />;
    }

    // 兜底：如果都没匹配到（理论上筛选逻辑过滤了，不会走到这），显示原摘要
    return post.summary;
  };

  const navigate = useNavigate();

  // 引入数据 Hook
  const {
    loading,
    currentPosts,
    recentPosts,
    totalPages,
    currentPage,
    setCurrentPage,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    allTags,
    allCategories
  } = useBlogData();

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // 用于监听点击外部

  // 点击外部关闭下拉
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 标签点击处理
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 定义一个静态的映射表
  // Key 是你在 posts.json 里填写的分类名称，Value 是对应的图标组件
  const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    '游戏人生': <Folder size={16} />,
    '技术分享': <Clock size={16} />,
    '见解看法': <Hash size={16} />,
    '生活记录': <Coffee size={16} />,
    '开发日志': <BookOpen size={16} />,
  };
  // 定义一个兜底图标，防止你以后加了新分类但忘了在映射表里写图标
  const FALLBACK_ICON = <Tag size={16} />;

  // 核心结合逻辑
  const displayCategories = useMemo(() => {
    return allCategories.map(catName => ({
      name: catName,
      // 如果映射表里有这个分类就用对应的，没有就用兜底图标
      icon: CATEGORY_ICONS[catName] || FALLBACK_ICON
    }));
  }, [allCategories]);

  if (loading) return <div className={styles.loading}>加载中...</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerBgImage} />
        <div className={styles.headerOverlay}></div>
        <div className={styles.headerContent}>
          <h1 className='brand-gradient-text'>个人博客</h1>
          <p>记录与分享我的见解</p>
        </div>
      </header>

      <div className={styles.mainContentContainer}>
        <main className={styles.mainContent}>
          {/* 功能区 */}
          <section className={styles.functionArea}>
            <div className={styles.functionTop}>
              <div className={styles.searchWrapper}>
                <input
                  type="text"
                  placeholder="搜索标题或内容..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className={styles.dropdownWrapper} ref={dropdownRef}>
                <button
                  className={`${styles.categoryBtn} ${isCategoryOpen ? styles.btnActive : ''}`}
                  onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                >
                  {selectedCategory ? selectedCategory : '全部分类'}
                </button>

                <div className={`${styles.dropdownMenu} ${isCategoryOpen ? styles.show : ''}`}>
                  {/* 增加一个“查看全部”选项 */}
                  <div
                    className={styles.dropdownItem}
                    onClick={() => { setSelectedCategory(null); setIsCategoryOpen(false); }}
                  >
                    <span>📂</span> 全部
                  </div>
                  {/* 遍历合并后的 categories */}
                  {displayCategories.map((cat, index) => (
                    <div
                      key={index}
                      className={styles.dropdownItem}
                      onClick={() => { setSelectedCategory(cat.name); setIsCategoryOpen(false); }}
                    >
                      <span className={styles.icon}>{cat.icon}</span>
                      {cat.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 标签列表 */}
            <div className={styles.tagList}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagItem} ${selectedTags.includes(tag) ? styles.tagActive : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
              {/* 清除筛选按钮 (仅当有标签被选中时显示) */}
              {selectedTags.length > 0 && (
                <button className={styles.clearTags} onClick={() => setSelectedTags([])}>
                  <X size={14} /> 清除
                </button>
              )}
            </div>
          </section>

          <div className={styles.contentGrid}>
            {/* 左侧列表 */}
            <div className={styles.leftColumn}>
              {/* 当前分类/搜索 状态提示 */}
              {(selectedCategory || searchQuery || selectedTags.length > 0) && (
                <div className={styles.statusText}>
                  正在显示:
                  {selectedCategory && <span> [{selectedCategory}] </span>}
                  {searchQuery && <span> 包含"{searchQuery}" </span>}
                  {selectedTags.length > 0 && <span> 标签: {selectedTags.join('+')} </span>}
                  <span className={styles.resultCount}> (共 {currentPosts.length} 篇)</span>
                </div>
              )}

              <div className={styles.blogCardGrid}>
                {currentPosts.length > 0 ? (
                  currentPosts.map(post => (
                    <div key={post.id} className={styles.blogCard}
                      onClick={() => navigate(`/post/${post.id}`)} // 点击卡片跳转
                    >
                      <div className={styles.cardImageWrapper}>
                        {/* 处理图片路径：如果是完整http链接则直接用，否则拼接 R2 URL */}
                        <img
                          src={post.cover.startsWith('http') ? post.cover : `${ASSET_BASE_URL}/posts/${post.cover}`}
                          alt={post.title}
                        />
                        <span className={styles.postDate}>发布于 {post.date}</span>
                        {/* [修改] 标题也支持高亮 */}
                        <h2 className={styles.postTitle}>
                          <HighlightText text={post.title} highlight={searchQuery} />
                        </h2>
                      </div>
                      <div className={styles.cardInfo}>
                        {/* [修改] 摘要部分：使用 getSearchSnippet 智能生成 */}
                        <p className={styles.excerpt}>
                          {getSearchSnippet(post, searchQuery)}
                        </p>
                        <div className={styles.cardTags}>
                          {post.tags.map(tag => (
                            <span key={tag}># {tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.noData}>没有找到相关文章...</div>
                )}
              </div>

              {/* 分页按钮 */}
              {totalPages > 1 && (
                <nav className={styles.pagination}>
                  <button
                    className={styles.pageArrow}
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  >
                    上一页
                  </button>
                  <div className={styles.pageNumbers}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                      <span
                        key={pageNum}
                        className={`${styles.pageNum} ${currentPage === pageNum ? styles.activePage : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </span>
                    ))}
                  </div>
                  <button
                    className={styles.pageArrow}
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  >
                    下一页
                  </button>
                </nav>
              )}
            </div>

            {/* 右侧：最近发布 */}
            <aside className={styles.rightColumn}>
              <div className={styles.recentPanel}>
                <h3 className='text-shadow-sm'>最近发布</h3>
                {recentPosts.map(post => (
                  <div key={post.id} className={styles.recentItem}
                    onClick={() => navigate(`/post/${post.id}`)}>
                    <img
                      src={post.cover.startsWith('http') ? post.cover : `${ASSET_BASE_URL}/posts/${post.cover}`}
                      alt="thumb"
                    />
                    <div className={styles.recentText}>
                      <span className={styles.recentDate}>{post.date}</span>
                      <p>{post.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h2 className='text-shadow-sm'>社交媒体</h2>
              {/* 社交媒体面板 */}
              <div className={styles.socialPanel}>

                {/* B站链接 */}
                <a href="https://space.bilibili.com/1754165806" target="_blank" rel="noreferrer" className={`${styles.socialItem} ${styles.bilibili}`}>
                  <div className={styles.avatarWrapper}>
                    <img src={`${ASSET_BASE_URL}/media/avatar/columbina.avif`} alt="Bilibili Avatar" className={styles.userAvatar} />
                    {/* 统一用一个 class 包裹 */}
                    <div className={styles.platformIcon}>
                      <BilibiliIcon/>
                    </div>
                  </div>
                  <div className={styles.socialInfo}>
                    <span className={styles.platformName}>Bilibili</span>
                    <p className={styles.socialStatus}>点击关注动态</p>
                  </div>
                </a>

                {/* X 链接 */}
                <a href="https://x.com/sylunae" target="_blank" rel="noreferrer" className={`${styles.socialItem} ${styles.xPlatform}`}>
                  <div className={styles.avatarWrapper}>
                    <img src={`${ASSET_BASE_URL}/media/avatar/pandora.avif`} alt="X Avatar" className={styles.userAvatar} />
                    {/* 使用同样的 class */}
                    <div className={styles.platformIcon}>
                      <XIcon/>
                    </div>
                  </div>
                  <div className={styles.socialInfo}>
                    <span className={styles.platformName}>X (Twitter)</span>
                    <p className={styles.socialStatus}>关注最新推文</p>
                  </div>
                </a>
              </div>
            </aside>
          </div>
        </main>
      </div>

    </div>
  );
};

export default BlogPage;