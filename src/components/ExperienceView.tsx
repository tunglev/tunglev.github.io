import React, { useMemo } from 'react';
import { getAllExperiences, ExperienceBullet } from '../lib/contentLoader';

function ExperienceIcon({ iconType }: { iconType: string }) {
  const iconClass = "w-5 h-5 shrink-0 text-[#1DB954] mt-0.5";
  switch (iconType) {
    case 'chip':
    case 'pcb':
    case 'cpu':
    case 'hardware':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <rect x="9" y="9" width="6" height="6" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M1 9h3M1 15h3M20 9h3M20 15h3" />
        </svg>
      );
    case 'gear':
    case 'cog':
    case 'settings':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case 'rocket':
    case 'flight':
    case 'drone':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.71.79-1.81.2-2.55L4.5 16.5z" />
          <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-3.05 11a22.35 22.35 0 0 1-3.95 2z" />
          <path d="M9 12l-5 5" />
          <path d="M12 15l5-5" />
        </svg>
      );
    case 'zap':
    case 'power':
    case 'lightning':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      );
    case 'database':
    case 'server':
    case 'storage':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      );
    case 'network':
    case 'api':
    case 'gateway':
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="16" y="16" width="6" height="6" rx="1" />
          <rect x="2" y="16" width="6" height="6" rx="1" />
          <rect x="9" y="2" width="6" height="6" rx="1" />
          <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
          <path d="M12 12V8" />
        </svg>
      );
    case 'chart':
    case 'telemetry':
    case 'monitor':
    default:
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <path d="M6 11l3-3 3 3 6-6" />
        </svg>
      );
  }
}

export function ExperienceView() {
  const experiences = useMemo(() => getAllExperiences(), []);

  return (
    <div className="w-full max-w-4xl mx-auto py-2 flex flex-col items-center">
      {/* Timeline Log Entries */}
      <div className="w-full flex flex-col space-y-[clamp(16px,3vw,32px)] bg-[#fbf9f5]/90 backdrop-blur-xs p-[clamp(16px,3vw,32px)] rounded-[clamp(16px,2.5vw,28px)] border border-[#e5e2da] shadow-xs">
        {experiences.map((exp, idx) => (
          <div key={exp.metadata.id || idx} className="w-full grid grid-cols-[clamp(85px,16vw,160px)_1fr] gap-[clamp(8px,2.5vw,36px)] items-start">
            {/* Left Date Column */}
            <div className="flex justify-end pt-1 shrink-0">
              <span className="bg-[#eaf7ef] text-[#137535] border border-[#b3e6c4] text-[clamp(9px,1.3vw,12px)] font-mono font-bold px-[clamp(6px,1vw,12px)] py-1 rounded-xs select-none whitespace-nowrap">
                {exp.metadata.period}
              </span>
            </div>

            {/* Right Details Column with left border line */}
            <div className="border-l border-[#e2dfd7] pl-[clamp(10px,2vw,36px)] flex flex-col items-start min-w-0">
              {/* Tag */}
              <span className="border border-[#c0bdb5] text-[clamp(9px,1.2vw,11px)] font-mono font-bold text-[#404348] px-[clamp(6px,0.8vw,10px)] py-0.5 rounded-xs tracking-wider uppercase mb-[clamp(6px,1vw,12px)] bg-[#fdfcf9] select-none">
                {exp.metadata.tag}
              </span>

              {/* Company Name */}
              <h2 className="text-[clamp(18px,3vw,36px)] font-extrabold text-[#282a2d] tracking-tight mb-1">
                {exp.metadata.company}
              </h2>

              {/* Role Title */}
              <p className="text-[clamp(11px,1.6vw,15px)] font-mono text-[#5c6068] mb-[clamp(8px,1.5vw,16px)]">
                {exp.metadata.role}
              </p>

              {/* Divider Line */}
              <div className="w-full h-[1px] bg-[#e8e5de] mb-[clamp(10px,2vw,24px)]" />

              {/* Bullet Points */}
              <div className="space-y-[clamp(8px,1.5vw,16px)] mb-[clamp(10px,2vw,24px)]">
                {exp.bullets.map((bullet: ExperienceBullet, bIdx: number) => (
                  <div key={bIdx} className="flex items-start gap-[clamp(6px,1.2vw,14px)] text-[clamp(11px,1.5vw,15px)] text-[#3a3e43] leading-relaxed">
                    <span className="shrink-0">
                      <ExperienceIcon iconType={bullet.iconType} />
                    </span>
                    <span className="font-mono">{bullet.text}</span>
                  </div>
                ))}
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap items-center gap-[clamp(4px,1vw,8px)]">
                {exp.metadata.skills.map((skill) => (
                  <span
                    key={skill}
                    className="border border-[#c0bdb5] text-[clamp(9px,1.3vw,12px)] font-mono text-[#404348] px-[clamp(6px,1vw,10px)] py-0.5 rounded-xs bg-[#fdfcf9] font-medium select-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
