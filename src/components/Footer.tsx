import React from 'react';

export function Footer() {
  const socialLinks = [
    { key: 'x', label: '𝕏', url: 'https://x.com' },
    { key: 'l', label: 'linkedIn', url: 'https://linkedin.com' },
    { key: 'g', label: 'github', url: 'https://github.com' },
  ];

  return (
    <footer className="w-full bg-transparent border-t border-[#e8e5de]/60 py-[clamp(24px,4vw,56px)] px-4 mt-auto select-none overflow-x-hidden">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center w-full">
        {/* Main Heading */}
        <h2 className="text-[clamp(18px,3vw,36px)] font-extrabold text-[#2d3135] tracking-tight mb-[clamp(16px,2.5vw,32px)]">
          Feel free to say hi
        </h2>

        {/* Social Shortcut Links */}
        <div className="flex flex-wrap items-center justify-center gap-[clamp(16px,3.5vw,48px)] font-mono">
          {socialLinks.map((link) => (
            <a
              key={link.key}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-[clamp(4px,1vw,10px)] text-[#3e4247] hover:text-[#1DB954] transition-colors focus:outline-none"
            >
              <span className="text-[#1DB954] group-hover:text-[#1aa34a] text-[clamp(13px,1.8vw,18px)] font-mono transition-colors">
                [{link.key}]
              </span>
              <span className="text-[clamp(13px,1.8vw,18px)] font-mono tracking-wide">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
