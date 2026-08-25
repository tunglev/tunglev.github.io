import React from 'react';
import { Monitor, AlertTriangle } from 'lucide-react';

export function MobileWarningOverlay() {
  return (
    <div
      id="mobile-desktop-warning-overlay"
      className="fixed inset-0 z-[999999] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center select-none md:hidden touch-none"
      role="alertdialog"
      aria-modal="true"
      aria-label="Desktop view warning"
    >
      <div className="max-w-xs sm:max-w-sm w-full bg-[#161616]/95 border border-white/10 rounded-2xl p-7 flex flex-col items-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 text-[#faf8f5]">
          <Monitor className="w-7 h-7 text-[#1DB954]" strokeWidth={1.8} />
        </div>

        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-mono font-medium uppercase tracking-wider mb-3">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Notice</span>
        </div>

        <p className="text-white text-base sm:text-lg font-medium leading-relaxed tracking-tight text-balance">
          This portfolio is meant for desktop use for the best experience.
        </p>

        <div className="mt-5 pt-4 border-t border-white/10 w-full">
          <p className="text-xs text-neutral-400 font-mono">
            Please visit on a desktop or laptop browser.
          </p>
        </div>
      </div>
    </div>
  );
}
