import React, { useRef, useState } from 'react';
import { Headphones, Play } from 'lucide-react';
import { ProjectDemo } from '../lib/contentLoader';

interface ProjectDemoReelProps {
  demos: ProjectDemo[];
}

export function ProjectDemoReel({ demos }: ProjectDemoReelProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeDemo = demos[activeIndex];

  if (!activeDemo) return null;

  return (
    <section aria-label="Project videos" className="mb-8 overflow-hidden rounded-2xl border border-[#2e4436] bg-[#142019] shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-[#b9c7bd]">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#1DB954]" />
          Prototype in action
        </span>
        <span className="inline-flex items-center gap-1.5"><Headphones size={12} aria-hidden="true" /> Use headphones · sound on</span>
      </div>
      <figure>
        <div className="relative">
          <video
            ref={videoRef}
            key={activeDemo.src}
            src={activeDemo.src}
            poster={activeDemo.poster}
            controls
            playsInline
            preload="none"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            aria-label={activeDemo.title}
            aria-describedby="project-demo-caption"
            className="block aspect-video w-full bg-[#0b120e] object-contain"
          >
            Your browser does not support embedded video. <a href={activeDemo.src}>Download this demo</a>.
          </video>
          {!isPlaying && (
            <button
              type="button"
              aria-label={`Play ${activeDemo.title}`}
              onClick={() => { void videoRef.current?.play().catch(() => setIsPlaying(false)); }}
              className="absolute inset-0 m-auto flex h-16 w-16 cursor-pointer items-center justify-center rounded-full border border-white/60 bg-[#142019]/85 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-[#137535] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#75db98]"
            >
              <Play size={25} fill="currentColor" aria-hidden="true" className="ml-1" />
            </button>
          )}
        </div>
        <figcaption id="project-demo-caption" className="border-t border-white/10 px-4 py-4">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="font-mono text-[10px] text-[#75db98]">{String(activeIndex + 1).padStart(2, '0')} / {String(demos.length).padStart(2, '0')}</span>
            <span className="text-sm font-semibold text-[#f5f2ea]">{activeDemo.title}</span>
          </div>
          <p className="text-xs leading-relaxed text-[#bac7be]">{activeDemo.caption}</p>
        </figcaption>
      </figure>
      {demos.length > 1 && (
        <div className="grid grid-cols-1 gap-2 border-t border-white/10 p-3 sm:grid-cols-3" aria-label="Choose a demo">
          {demos.map((demo, index) => (
            <button
              key={demo.src}
              type="button"
              aria-pressed={index === activeIndex}
              onClick={() => {
                if (index !== activeIndex) {
                  setIsPlaying(false);
                  setActiveIndex(index);
                }
              }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-3 text-left font-mono text-[10px] leading-relaxed transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75db98] ${
                index === activeIndex
                  ? 'border-[#1DB954]/70 bg-[#1DB954]/15 text-[#a0efba]'
                  : 'border-white/10 bg-white/5 text-[#c1cbc4] hover:border-white/30 hover:bg-white/10'
              }`}
            >
              <Play size={12} aria-hidden="true" className="shrink-0" />
              <span>{demo.title}</span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
