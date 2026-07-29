import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

interface InteractivePdfLinkProps {
  href: string;
  children: React.ReactNode;
}

export function InteractivePdfLink({ href, children }: InteractivePdfLinkProps) {
  // Extract text from children
  const text = typeof children === 'string' ? children : 'View PDF Document';

  return (
    <span className="inline-block my-1 max-w-full" id="interactive-pdf-link-wrapper">
      <span className="inline-flex items-center gap-2 flex-wrap">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 bg-[#f4f1e8]/80 hover:bg-[#eaf7ef]/90 text-[#383b3e] hover:text-[#137535] border border-[#e2dfd7] hover:border-[#b3e6c4] px-2.5 py-1 rounded font-mono text-xs font-semibold select-none transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-[#137535]" />
          <span>{text}</span>
          <ExternalLink className="w-3 h-3 text-[#636870]" />
        </a>
      </span>
    </span>
  );
}
