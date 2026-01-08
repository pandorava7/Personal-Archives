import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { ChevronLeft } from 'lucide-react';
import styles from './PostDetail.module.css';
import 'highlight.js/styles/atom-one-dark.css';
import { ASSET_BASE_URL } from '../../config/assets';
import { useNavigate } from 'react-router-dom';
import matter from 'gray-matter'; // 1. 引入 gray-matter
import { Buffer } from 'buffer';  // 2. 引入 Buffer 兼容浏览器

// 将原来的 if (!window.Buffer) ... 改为：
if (typeof window !== 'undefined' && !(window as any).Buffer) {
    (window as any).Buffer = Buffer;
}

const PostDetail: React.FC<{ postId: string }> = ({ postId }) => {
    const navigate = useNavigate();

    const [content, setContent] = useState('');
    const [metadata, setMetadata] = useState<any>(null);
    const [readingTime, setReadingTime] = useState(0);

    useEffect(() => {
        // 1. 获取帖子详情（可以从之前的 posts.json 中找到该 ID 的元数据）
        fetch(`${ASSET_BASE_URL}/posts.json`)
            .then(res => res.json())
            .then(data => {
                const post = data.find((p: any) => p.id === postId);
                setMetadata(post);

                // 2. 获取真实的 Markdown 文件内容
                return fetch(`${ASSET_BASE_URL}/posts/${post.link}`);
            })
            .then(res => res.text())
            .then(text => {
                // 4. 使用 gray-matter 解析原始文本
                // data 是头部元数据，content 是剥离后的正文
                const { content: pureContent } = matter(text);

                setContent(pureContent);
                // 估算阅读时间 (假设每分钟读 400 字)
                setReadingTime(Math.ceil(pureContent.length / 400));
            });
    }, [postId]);

    if (!metadata) return <div className={styles.loading}>加载中...</div>;

    return (
        <div className={styles.container}>
            {/* Hero 背景 */}
            <div className={styles.heroSection}>
                <img src={`${ASSET_BASE_URL}/posts/${metadata.cover}`} className={styles.heroBg} />
                <div className={styles.heroOverlay}></div>
                <nav className={styles.navBar}>
                    <button className={styles.backBtn} onClick={() => navigate(-1)}>
                        <ChevronLeft /> 返回
                    </button>
                </nav>
            </div>

            {/* 主要内容卡片 */}
            <div className={styles.mainLayout}>
                <article className={styles.articleCard}>
                    {/* 标题区 */}
                    <header className={styles.articleHeader}>
                        <h1 className={styles.title}>{metadata.title}</h1>
                        <div className={styles.metaRow}>
                            <span className={styles.categoryTag}>{metadata.category}</span>
                            <span>{metadata.date}</span>
                            <span>· 阅读约 {readingTime} 分钟</span>
                        </div>
                    </header>

                    {/* Markdown 正文 - 关键是将样式类应用在这里 */}
                    <div className={styles.markdownContent}>
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[rehypeRaw, rehypeHighlight]}
                            components={{
                                a: ({ node, ...props }) => (
                                    <a {...props} target="_blank" rel="noopener noreferrer" />
                                )
                            }}
                        >
                            {/* 5. 这里传入的是已经剥离了元数据的 pureContent */}
                            {content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
        </div>
    );
};

export default PostDetail;