import React from 'react';
import Markdown from 'react-markdown';
import { ProjectPost, getSnippet, resolveAssetUrl } from '../lib/contentLoader';
import { ThumbnailRenderer } from './ThumbnailRenderer';

interface ProjectDetailViewProps {
  post: ProjectPost;
  onBack: () => void;
}

export function ProjectDetailView({ post, onBack }: ProjectDetailViewProps) {
  const { metadata, content } = post;
  const footerSnippet = getSnippet('footer-note.md');

  return (
    <div className="w-full max-w-2xl mx-auto px-1 py-2 flex flex-col items-center">
      {/* Centered Column Container with Left-Anchored Content */}
      <article className="w-full text-left font-sans text-[#383b3e] bg-[#fbf9f5]/90 backdrop-blur-xs p-[clamp(16px,3vw,32px)] rounded-[clamp(16px,2.5vw,28px)] border border-[#e5e2da] shadow-xs">
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
              metadata.thumbnailImage ? 'p-0' : 'p-6'
            }`}
            style={{ backgroundColor: metadata.thumbnailBg }}
          >
            <div className={`w-full h-full flex items-center justify-center ${
              metadata.thumbnailImage ? '' : 'transform scale-110 transition-transform hover:scale-115'
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
            components={{
              h1: ({ children }) => (
                <h1 className="text-[clamp(20px,3vw,30px)] font-extrabold text-[#282a2d] tracking-tight mt-8 mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-[clamp(18px,2.5vw,24px)] font-bold text-[#282a2d] tracking-tight mt-6 mb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-[clamp(14px,1.8vw,18px)] font-bold text-[#282a2d] mt-8 mb-4 font-mono tracking-tight pt-4 border-t border-[#e2dfd7]">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="mb-[clamp(14px,2.2vw,22px)] text-[#383b3e] leading-[1.75]">
                  {children}
                </p>
              ),
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
              img: ({ src, alt }) => {
                const resolvedSrc = src ? resolveAssetUrl(src) : '';
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
            }}
          >
            {content}
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
