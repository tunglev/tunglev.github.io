import React, { useState, useMemo } from 'react';
import { FileText, ExternalLink, Download, Eye, EyeOff } from 'lucide-react';

interface PdfEmbedProps {
  src: string;
  title?: string;
  initialExpanded?: boolean;
}

export function PdfEmbed({ src, title = 'Document.pdf', initialExpanded = true }: PdfEmbedProps) {
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  // Extract a clean file name from path if title is generic
  const cleanTitle = useMemo(() => {
    if (title && title !== 'Document.pdf' && !title.endsWith('.pdf')) {
      return title;
    }
    try {
      const decoded = decodeURIComponent(src);
      const parts = decoded.split('/');
      const last = parts[parts.length - 1];
      if (last) {
        // Strip out hashes or query params
        return last.split('?')[0].split('#')[0];
      }
    } catch (e) {
      // fallback
    }
    return title;
  }, [src, title]);

  const embedContent = (
    <div className="flex flex-col w-full h-full bg-[#fcfbfa]">
      <object
        data={`${src}#toolbar=1`}
        type="application/pdf"
        className="w-full h-full min-h-[500px] flex-1 border-0"
      >
        <iframe
          src={`${src}#toolbar=1`}
          className="w-full h-full min-h-[500px] flex-1 border-0"
          title={cleanTitle}
        >
          <div className="flex flex-col items-center justify-center p-12 text-center bg-[#fcfbfa] h-full">
            <FileText className="w-16 h-16 text-[#636870] mb-4" />
            <p className="text-[clamp(14px,1.8vw,16px)] font-medium text-[#282a2d] mb-2">
              Unable to display PDF inline
            </p>
            <p className="text-xs text-[#636870] mb-6 max-w-sm mx-auto">
              Your browser or device might not support embedded PDFs. You can open or download it directly instead.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#1DB954] hover:bg-[#1aa34a] text-white font-mono font-bold text-xs uppercase px-5 py-3 rounded-lg shadow-sm transition-colors cursor-pointer select-none"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in New Tab</span>
              </a>
              <a
                href={src}
                download={cleanTitle}
                className="inline-flex items-center justify-center gap-2 bg-[#f4f1e8] hover:bg-[#e8e5de] text-[#383b3e] font-mono font-semibold text-xs uppercase px-5 py-3 rounded-lg border border-[#e2dfd7] transition-colors cursor-pointer select-none"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>
        </iframe>
      </object>
    </div>
  );

  return (
    <div className="w-full my-6 flex flex-col rounded-xl border border-[#e2dfd7] bg-[#fbf9f5] overflow-hidden shadow-xs" id="pdf-embed-container">
      {/* Header Bar */}
      <div className="w-full flex items-center justify-between bg-[#f4f1e8] py-3 px-4 border-b border-[#e2dfd7]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 bg-[#1DB954]/10 rounded-lg text-[#137535] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-xs sm:text-sm text-[#282a2d] truncate max-w-[150px] sm:max-w-xs md:max-w-md">
              {cleanTitle}
            </h4>
            <span className="inline-block text-[9px] font-mono font-bold text-[#137535] bg-[#eaf7ef] border border-[#b3e6c4] px-1.5 py-0.5 rounded uppercase tracking-wider">
              PDF Document
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          {/* Collapse Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-[#e8e5de] rounded-lg text-[#636870] hover:text-[#282a2d] transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse PDF' : 'Expand PDF'}
          >
            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-[#e8e5de] rounded-lg text-[#636870] hover:text-[#282a2d] transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <a
            href={src}
            download={cleanTitle}
            className="p-2 hover:bg-[#e8e5de] rounded-lg text-[#636870] hover:text-[#282a2d] transition-colors"
            title="Download PDF"
          >
            <Download className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Embedded Reader Content */}
      {isExpanded ? (
        <div className="w-full h-[550px] relative bg-white">
          {embedContent}
        </div>
      ) : (
        <div 
          onClick={() => setIsExpanded(true)}
          className="w-full py-4 px-6 flex items-center justify-center text-center bg-[#fcfbfa] hover:bg-[#faf7ee]/50 border-t border-[#e2dfd7] cursor-pointer group transition-colors"
        >
          <span className="text-xs font-mono font-semibold text-[#636870] group-hover:text-[#1DB954] transition-colors">
            Click to expand and view interactive PDF document
          </span>
        </div>
      )}
    </div>
  );
}
