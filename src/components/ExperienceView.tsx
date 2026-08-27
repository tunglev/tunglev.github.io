import React, { useMemo } from 'react';
import { getAllExperiences } from '../lib/contentLoader';

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
              {/* Company Name */}
              <h2 className="text-[clamp(18px,3vw,36px)] font-extrabold text-[#282a2d] tracking-tight mb-1">
                {exp.metadata.company}
              </h2>

              {/* Role Title */}
              <p className="text-[clamp(11px,1.6vw,15px)] font-mono text-[#5c6068] mb-[clamp(10px,1.8vw,18px)]">
                {exp.metadata.role}
              </p>

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
