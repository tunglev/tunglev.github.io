import React, { useMemo } from 'react';
import Markdown from 'react-markdown';
import { getHomeContent, resolveAssetUrl } from '../lib/contentLoader';

export function HomeView() {
  const homeData = useMemo(() => getHomeContent(), []);
  const { metadata, content } = homeData;

  return (
    <div className="w-full max-w-3xl mx-auto py-4 px-2 flex flex-col items-start text-left">
      {/* Frontmatter Profile Header */}
      {metadata.name && (
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full">
          {metadata.avatar && (
            <div className="shrink-0 relative group">
              <img
                src={metadata.avatar}
                alt={metadata.name}
                className="w-[200px] h-[200px] rounded-2xl object-cover border-2 border-white shadow-md bg-white/80 ring-1 ring-gray-200"
                referrerPolicy="no-referrer"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" title="Active" />
            </div>
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
              return (
                <span className="block my-6 rounded-lg overflow-hidden border border-gray-200 shadow-xs">
                  <img
                    src={resolvedSrc}
                    alt={alt || ''}
                    className="w-full h-auto object-cover max-h-[500px]"
                    referrerPolicy="no-referrer"
                  />
                </span>
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
