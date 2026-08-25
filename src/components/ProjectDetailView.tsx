import React, { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ProjectPost, getSnippet, resolveAssetUrl } from '../lib/contentLoader';
import { ThumbnailRenderer } from './ThumbnailRenderer';
import { PdfEmbed } from './PdfEmbed';
import { InteractivePdfLink } from './InteractivePdfLink';

interface ProjectDetailViewProps {
  post: ProjectPost;
  onBack: () => void;
}

// Extract pure text from React children to generate heading IDs
function getTextFromNode(node: any): string {
  if (!node) return '';
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getTextFromNode).join('');
  if (node.props && node.props.children) return getTextFromNode(node.props.children);
  return '';
}

export function ProjectDetailView({ post, onBack }: ProjectDetailViewProps) {
  const { metadata, content } = post;
  const footerSnippet = getSnippet('footer-note.md');

  const hasImage = !!(
    metadata.thumbnailImage ||
    (metadata.thumbnailType &&
      (metadata.thumbnailType.includes('/') ||
        metadata.thumbnailType.includes('.') ||
        metadata.thumbnailType.startsWith('http') ||
        metadata.thumbnailType.startsWith('data:')))
  );

  // Preprocess content to convert special <toc-item text="..." /> tags to standard headings
  const processedContent = useMemo(() => {
    let result = content;
    
    // Replace <toc-item text="My Custom Sidebar Item" /> with ## TOC-SPECIAL: My Custom Sidebar Item
    result = result.replace(
      /<toc-item\s+text=["']([^"']+)["'](?:\s+id=["']([^"']+)["'])?\s*(?:\/>|><\/toc-item>)/gi,
      (match, text) => {
        return `\n\n## TOC-SPECIAL: ${text}\n\n`;
      }
    );

    return result;
  }, [content]);

  // Parse headings (H2 by default, plus special TOC-SPECIAL items) for the Table of Contents scroll spy
  const headings = useMemo(() => {
    const headingRegex = /^##\s+(.+)$/gm;
    const found: { id: string; text: string; level: number }[] = [];
    let match;
    headingRegex.lastIndex = 0;
    while ((match = headingRegex.exec(processedContent)) !== null) {
      let text = match[1].trim();
      const isSpecial = text.startsWith('TOC-SPECIAL:');
      
      if (isSpecial) {
        text = text.replace('TOC-SPECIAL:', '').trim();
      }
      
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      found.push({ id, text, level: 2 });
    }
    return found;
  }, [processedContent]);

  // Scrollspy to highlight active headers on the left
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const handleScroll = () => {
      let currentActiveId: string | null = null;
      let minDistance = Infinity;
      const targetY = 120; // threshold from top of viewport

      headings.forEach((heading) => {
        const el = document.getElementById(heading.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Distance from the target line
          const dist = rect.top - targetY;
          if (rect.top <= targetY + 50) {
            if (Math.abs(dist) < minDistance) {
              minDistance = Math.abs(dist);
              currentActiveId = heading.id;
            }
          }
        }
      });

      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id;
      }

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 flex flex-col lg:flex-row gap-8 items-start">
      
      {/* Sidebar Sticky Column on Left (visible on lg screens and up) */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-60 shrink-0 sticky top-28 self-start bg-[#fbf9f5]/90 backdrop-blur-xs p-5 rounded-2xl border border-[#e5e2da] shadow-xs select-none max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar">
          <h4 className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#636870] mb-3">
            On This Page
          </h4>
          <nav className="space-y-2">
            {headings.map((heading) => {
              const isActive = activeId === heading.id;
              return (
                <a
                  key={heading.id}
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(heading.id);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`block text-[12px] font-mono transition-all duration-200 border-l-2 pl-3 ${
                    isActive
                      ? 'border-[#1DB954] text-[#1DB954] font-bold translate-x-0.5'
                      : 'border-transparent text-[#636870] hover:text-[#282a2d] hover:border-[#e2dfd7]'
                  } ${heading.level === 3 ? 'ml-3 text-[11px] font-normal' : ''}`}
                >
                  {heading.text}
                </a>
              );
            })}
          </nav>
        </aside>
      )}

      {/* Centered Column Container with Left-Anchored Content */}
      <article className="flex-1 min-w-0 text-left font-sans text-[#383b3e] bg-[#fbf9f5]/90 backdrop-blur-xs p-[clamp(16px,3vw,32px)] rounded-[clamp(16px,2.5vw,28px)] border border-[#e5e2da] shadow-xs w-full">
        {/* Top Back Button */}
        <a
          href="/project"
          onClick={(e) => {
            e.preventDefault();
            onBack();
          }}
          className="group inline-flex items-center gap-2 text-[#636870] hover:text-[#1DB954] text-[clamp(12px,1.5vw,14px)] font-mono font-medium mb-[clamp(16px,2.5vw,28px)] cursor-pointer transition-colors focus:outline-none select-none no-underline"
        >
          <span className="text-[#1DB954] group-hover:-translate-x-1 transition-transform">←</span>
          <span>back to projects</span>
        </a>

        {/* Title */}
        <h1 className="text-[clamp(22px,3.8vw,42px)] font-extrabold text-[#282a2d] tracking-tight leading-[1.2] mb-[clamp(8px,1.5vw,16px)]">
          {metadata.title}
        </h1>

        {/* Date & Read Time */}
        <div className="flex items-center gap-2 text-[clamp(12px,1.5vw,14px)] font-mono text-[#636870] mb-[clamp(20px,3vw,36px)] select-none">
          <span>{metadata.date}</span>
          <span>·</span>
          <span>{metadata.readTime}</span>
        </div>

        {/* Image Card / Banner in Article */}
        <div className="w-full mb-[clamp(20px,3.5vw,36px)] rounded-[clamp(12px,2vw,18px)] overflow-hidden border border-[#e2dfd7] bg-[#f5f2ea] shadow-xs flex flex-col items-center">
          <div
            className={`w-full h-[clamp(140px,28vw,260px)] flex items-center justify-center relative overflow-hidden ${
              hasImage ? 'p-0' : 'p-6'
            }`}
            style={hasImage ? undefined : { backgroundColor: metadata.thumbnailBg }}
          >
            <div className={`w-full h-full flex items-center justify-center ${
              hasImage ? '' : 'transform scale-110 transition-transform hover:scale-115'
            }`}>
              <ThumbnailRenderer type={metadata.thumbnailType} image={metadata.thumbnailImage} />
            </div>
          </div>
          {metadata.imageCaption && (
            <div className="w-full py-2.5 px-4 bg-[#f4f1e8] border-t border-[#e2dfd7] text-center">
              <span className="text-[clamp(11px,1.4vw,13px)] font-mono text-[#636870]">
                {metadata.imageCaption}
              </span>
            </div>
          )}
        </div>

        {/* Article Body - Rendered from Markdown Content File */}
        <div className="markdown-body text-[clamp(14px,1.8vw,17px)] text-[#383b3e] leading-[1.75] font-normal mb-[clamp(24px,3.5vw,40px)]">
          <Markdown
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ children }) => {
                const text = getTextFromNode(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');
                return (
                  <h1 id={id} className="text-[clamp(20px,3vw,30px)] font-extrabold text-[#282a2d] tracking-tight mt-8 mb-4 scroll-mt-28">
                    {children}
                  </h1>
                );
              },
              h2: ({ children }) => {
                const rawText = getTextFromNode(children);
                const isSpecial = rawText.startsWith('TOC-SPECIAL:');
                const text = isSpecial ? rawText.replace('TOC-SPECIAL:', '').trim() : rawText;
                
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');

                if (isSpecial) {
                  return (
                    <div id={id} className="scroll-mt-28 my-6 py-3 border-t border-b border-[#e2dfd7]/50 select-none flex items-center gap-2">
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-[#e2dfd7] text-[#636870] tracking-wider rounded-xs">TOC Tag</span>
                      <span className="text-[clamp(13px,1.6vw,15px)] font-mono font-bold uppercase tracking-wider text-[#4a4f56]">{text}</span>
                    </div>
                  );
                }

                return (
                  <h2 id={id} className="text-[clamp(18px,2.5vw,24px)] font-bold text-[#282a2d] tracking-tight mt-10 mb-4 scroll-mt-28 pt-2 border-b border-[#e2dfd7] pb-1">
                    {children}
                  </h2>
                );
              },
              h3: ({ children }) => {
                const text = getTextFromNode(children);
                const id = text
                  .toLowerCase()
                  .replace(/[^\w\s-]/g, '')
                  .replace(/\s+/g, '-');
                return (
                  <h3 id={id} className="text-[clamp(14px,1.8vw,18px)] font-bold text-[#282a2d] mt-8 mb-3 font-mono tracking-tight pt-4 border-t border-[#e2dfd7] scroll-mt-28">
                    {children}
                  </h3>
                );
              },
              p: ({ children }) => {
                const childrenArray = React.Children.toArray(children);
                const hasBlockElement = childrenArray.some((child) => {
                  if (React.isValidElement(child)) {
                    const type = child.type;
                    if (typeof type === 'string') {
                      return ['div', 'video', 'iframe', 'table', 'blockquote', 'ol', 'ul'].includes(type);
                    }
                    return true;
                  }
                  return false;
                });

                if (hasBlockElement) {
                  return (
                    <div className="mb-[clamp(14px,2.2vw,22px)] text-[#383b3e] leading-[1.75] font-normal">
                      {children}
                    </div>
                  );
                }

                return (
                  <p className="mb-[clamp(14px,2.2vw,22px)] text-[#383b3e] leading-[1.75]">
                    {children}
                  </p>
                );
              },
              ul: ({ children }) => (
                <ul className="space-y-[clamp(10px,1.5vw,16px)] font-mono text-[clamp(12px,1.5vw,14px)] text-[#383b3e] my-6">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="flex items-start gap-[clamp(8px,1.5vw,14px)] bg-[#f4f1e8]/80 border-l-2 border-[#1DB954] p-[clamp(10px,1.5vw,14px)] rounded-r-md">
                  <span className="text-[#1DB954] font-bold shrink-0">▸</span>
                  <div className="leading-relaxed">{children}</div>
                </li>
              ),
              strong: ({ children }) => (
                <strong className="text-[#202225] font-semibold">{children}</strong>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-[#1DB954] pl-4 italic text-[#484c52] my-6 bg-[#f4f1e8]/70 py-3 pr-3 rounded-r">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-[#eaf7ef] text-[#137535] font-mono text-sm px-1.5 py-0.5 rounded border border-[#b3e6c4]">
                  {children}
                </code>
              ),
              table: ({ children }) => (
                <div className="w-full overflow-x-auto my-6 border border-[#e2dfd7] rounded-lg bg-[#fdfcf9] shadow-xs">
                  <table className="w-full border-collapse text-left text-sm font-mono text-[#383b3e]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[#f4f1e8] border-b border-[#e2dfd7] font-bold text-[#282a2d]">
                  {children}
                </thead>
              ),
              tbody: ({ children }) => (
                <tbody className="divide-y divide-[#e2dfd7]">
                  {children}
                </tbody>
              ),
              tr: ({ children }) => (
                <tr className="hover:bg-[#fbf9f5]/50 transition-colors odd:bg-white even:bg-[#fcfbf9]">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider text-[#282a2d] border-r border-[#e2dfd7] last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-xs leading-relaxed text-[#5c6068] border-r border-[#e2dfd7] last:border-r-0">
                  {children}
                </td>
              ),
              img: ({ src, alt }) => {
                const resolvedSrc = src ? resolveAssetUrl(src) : '';
                const isPdf = src && src.toLowerCase().endsWith('.pdf');
                if (isPdf) {
                  return <PdfEmbed src={resolvedSrc} title={alt || ''} />;
                }

                // Video check
                const isVideo = src && (
                  src.toLowerCase().endsWith('.mp4') ||
                  src.toLowerCase().endsWith('.webm') ||
                  src.toLowerCase().endsWith('.ogg') ||
                  src.includes('youtube.com') ||
                  src.includes('youtu.be') ||
                  src.includes('vimeo.com')
                );

                if (isVideo) {
                  if (src.includes('youtube.com') || src.includes('youtu.be')) {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = src.match(regExp);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    if (videoId) {
                      return (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#e2dfd7] my-6 shadow-xs">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={alt || "YouTube video"}
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                  }

                  if (src.includes('vimeo.com')) {
                    const match = src.match(/vimeo\.com\/(\d+)/);
                    const vimeoId = match ? match[1] : null;
                    if (vimeoId) {
                      return (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#e2dfd7] my-6 shadow-xs">
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}`}
                            title={alt || "Vimeo video"}
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                  }

                  return (
                    <span className="block my-6 rounded-lg overflow-hidden border border-[#e2dfd7] shadow-xs bg-black">
                      <video
                        src={resolvedSrc}
                        controls
                        className="w-full h-auto max-h-[500px] mx-auto"
                      />
                    </span>
                  );
                }

                return (
                  <span className="block my-6 rounded-lg overflow-hidden border border-[#e2dfd7] shadow-xs">
                    <img
                      src={resolvedSrc}
                      alt={alt || ''}
                      className="w-full h-auto object-cover max-h-[500px]"
                      referrerPolicy="no-referrer"
                    />
                  </span>
                );
              },
              a: ({ href, children }) => {
                const isPdf = href && href.toLowerCase().endsWith('.pdf');
                if (isPdf) {
                  const resolvedHref = href ? resolveAssetUrl(href) : '';
                  return <InteractivePdfLink href={resolvedHref}>{children}</InteractivePdfLink>;
                }

                // Video check
                const isVideo = href && (
                  href.toLowerCase().endsWith('.mp4') ||
                  href.toLowerCase().endsWith('.webm') ||
                  href.toLowerCase().endsWith('.ogg') ||
                  href.includes('youtube.com/watch') ||
                  href.includes('youtu.be/') ||
                  href.includes('vimeo.com/')
                );

                if (isVideo) {
                  if (href.includes('youtube.com') || href.includes('youtu.be')) {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = href.match(regExp);
                    const videoId = (match && match[2].length === 11) ? match[2] : null;
                    if (videoId) {
                      return (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#e2dfd7] my-4 shadow-xs">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                  }

                  if (href.includes('vimeo.com')) {
                    const match = href.match(/vimeo\.com\/(\d+)/);
                    const vimeoId = match ? match[1] : null;
                    if (vimeoId) {
                      return (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#e2dfd7] my-4 shadow-xs">
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}`}
                            title="Vimeo video player"
                            className="w-full h-full border-0"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      );
                    }
                  }

                  const resolvedHref = href ? resolveAssetUrl(href) : '';
                  return (
                    <span className="block my-4 rounded-lg overflow-hidden border border-[#e2dfd7] shadow-xs bg-black">
                      <video
                        src={resolvedHref}
                        controls
                        className="w-full h-auto max-h-[400px] mx-auto"
                      />
                    </span>
                  );
                }

                return (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1DB954] hover:underline font-mono text-[clamp(12px,1.5vw,14px)] font-medium transition-colors"
                  >
                    {children}
                  </a>
                );
              },
            }}
          >
            {processedContent}
          </Markdown>
        </div>

        {/* Footer Reusable Snippet */}
        {footerSnippet && (
          <div className="pt-4 pb-2 border-t border-[#e2dfd7] text-xs font-mono text-[#636870] italic">
            <Markdown>{footerSnippet}</Markdown>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="pt-[clamp(20px,3vw,36px)] border-t border-[#e8e5de] flex justify-start">
          <button
            onClick={onBack}
            className="group inline-flex items-center gap-2 text-[#636870] hover:text-[#1DB954] text-[clamp(12px,1.5vw,14px)] font-mono font-medium cursor-pointer transition-colors focus:outline-none select-none"
          >
            <span className="text-[#1DB954] group-hover:-translate-x-1 transition-transform">←</span>
            <span>back to projects</span>
          </button>
        </div>
      </article>
    </div>
  );
}
