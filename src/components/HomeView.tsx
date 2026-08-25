import React, { useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import { motion, AnimatePresence } from 'motion/react';
import { getHomeContent, resolveAssetUrl } from '../lib/contentLoader';
import { PdfEmbed } from './PdfEmbed';
import { InteractivePdfLink } from './InteractivePdfLink';

interface ClickParticle {
  id: number;
  x: number;
  y: number;
  char: string;
  angle: number;
  speed: number;
}

export function HomeView() {
  const homeData = useMemo(() => getHomeContent(), []);
  const { metadata, content } = homeData;

  const [particles, setParticles] = useState<ClickParticle[]>([]);

  const handleAvatarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const chars = ['0', '1', '⚡', '💻', '⚙️', '🚀', '🟢', '[OK]', '[SYS]', '1DB954'];
    
    const newParticles = Array.from({ length: 6 }).map(() => ({
      id: Math.random(),
      x: clickX,
      y: clickY,
      char: chars[Math.floor(Math.random() * chars.length)],
      angle: Math.random() * Math.PI * 2,
      speed: 2 + Math.random() * 4,
    }));

    setParticles(prev => [...prev, ...newParticles].slice(-24));
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2 flex flex-col items-start text-left">
      {/* Frontmatter Profile Header */}
      {metadata.name && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
          {metadata.avatar && (
            <motion.div 
              className="shrink-0 relative group cursor-pointer select-none active:scale-95"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94, rotate: Math.random() > 0.5 ? 4 : -4 }}
              onClick={handleAvatarClick}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <img
                src={metadata.avatar}
                alt={metadata.name}
                className="w-[200px] h-[200px] rounded-2xl object-cover border-2 border-white shadow-md bg-white/80 ring-1 ring-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Active" />
              
              {/* Particle Overlay */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.span
                    key={p.id}
                    initial={{ opacity: 1, scale: 0.8, x: p.x, y: p.y }}
                    animate={{ 
                      opacity: 0, 
                      scale: 1.3,
                      x: p.x + Math.cos(p.angle) * p.speed * 18,
                      y: p.y + Math.sin(p.angle) * p.speed * 18 - 30,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    onAnimationComplete={() => {
                      setParticles(prev => prev.filter(item => item.id !== p.id));
                    }}
                    className="absolute font-mono text-[#1DB954] text-xs font-bold pointer-events-none z-20 select-none bg-white/10 backdrop-blur-3hs px-1 py-0.5 rounded-xs"
                  >
                    {p.char}
                  </motion.span>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          <div className="flex flex-col items-start text-left">
            {metadata.role && (
              <span className="text-[clamp(11px,1.4vw,13px)] font-mono font-bold text-[#137535] bg-[#eaf7ef] border border-[#b3e6c4] px-3 py-1 rounded-full uppercase tracking-wider mb-2 select-none">
                {metadata.role}
              </span>
            )}
            <h1 className="text-[clamp(28px,5vw,50px)] font-extrabold text-[#282a2d] tracking-tight leading-tight mb-1">
              {metadata.name}
            </h1>
            {metadata.subtitle && (
              <p className="text-[clamp(13px,1.8vw,16px)] font-mono text-[#50545a] max-w-xl leading-relaxed">
                {metadata.subtitle}
              </p>
            )}
            {metadata.location && (
              <span className="text-[clamp(11px,1.4vw,13px)] font-mono text-[#656a72] mt-1">
                📍 {metadata.location}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Markdown Body - Rendered directly over binary background without solid card overlay */}
      <div className="markdown-body w-full text-left text-[clamp(14px,1.8vw,17px)] text-[#383b3e] leading-[1.75]">
        <Markdown
          components={{
            h1: ({ children }) => (
              <h1 className="text-[clamp(22px,3.5vw,34px)] font-extrabold text-[#282a2d] tracking-tight mt-6 mb-4 text-left">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-[clamp(18px,2.8vw,26px)] font-bold text-[#282a2d] tracking-tight mt-6 mb-3">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-[clamp(15px,2vw,20px)] font-bold text-[#282a2d] mt-6 mb-3 font-mono tracking-tight pt-2 border-t border-[#e2dfd7]">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="mb-4 text-[#383b3e] leading-[1.8] font-normal">
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul className="space-y-3 font-mono text-[clamp(13px,1.6vw,15px)] text-[#383b3e] my-4">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="flex items-start gap-3 bg-[#f5f3ee]/70 border-l-2 border-[#1DB954] p-3 rounded-r-md backdrop-blur-2hs">
                <span className="text-[#1DB954] font-bold shrink-0">▸</span>
                <div className="leading-relaxed">{children}</div>
              </li>
            ),
            strong: ({ children }) => (
              <strong className="text-[#202225] font-bold">{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-[#1DB954] pl-4 italic text-[#484c52] my-6 bg-[#f5f3ee]/60 p-4 rounded-r font-serif text-[clamp(15px,2vw,18px)]">
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code className="bg-[#eaf7ef] text-[#137535] font-mono text-sm px-1.5 py-0.5 rounded border border-[#b3e6c4]">
                {children}
              </code>
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
                src.toLowerCase().endsWith('.mov') ||
                src.includes('youtube.com') ||
                src.includes('youtu.be') ||
                src.includes('vimeo.com')
              );

              if (isVideo) {
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
                <span className="block w-full my-6 rounded-lg overflow-hidden border border-[#e2dfd7] shadow-xs bg-[#f8f6f0]">
                  <img
                    src={resolvedSrc}
                    alt={alt || ''}
                    className="w-full h-auto block"
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
                href.toLowerCase().endsWith('.mov') ||
                href.includes('vimeo.com/')
              );

              if (isVideo) {
                const resolvedHref = resolveAssetUrl(href);
                return (
                  <span className="block my-6 rounded-lg overflow-hidden border border-[#e2dfd7] shadow-xs bg-black">
                    <video
                      src={resolvedHref}
                      controls
                      className="w-full h-auto max-h-[500px] mx-auto"
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
          {content}
        </Markdown>
      </div>
    </div>
  );
}
