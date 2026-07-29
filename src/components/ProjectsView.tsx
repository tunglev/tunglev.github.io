import React, { useState, useMemo } from 'react';
import { getAllProjects } from '../lib/contentLoader';
import { ProjectDetailView } from './ProjectDetailView';
import { ThumbnailRenderer } from './ThumbnailRenderer';

interface ProjectsViewProps {
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
}

export function ProjectsView({
  selectedProjectId: externalSelectedProjectId,
  onSelectProject,
}: ProjectsViewProps) {
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState<string | null>(null);

  const activeProjectId =
    externalSelectedProjectId !== undefined
      ? externalSelectedProjectId
      : internalSelectedProjectId;

  const handleSelectProject = (id: string | null) => {
    if (onSelectProject) {
      onSelectProject(id);
    } else {
      setInternalSelectedProjectId(id);
    }
  };

  // Dynamically load all Markdown project posts from content base
  const projects = useMemo(() => getAllProjects(), []);

  if (activeProjectId) {
    const selectedProject = projects.find((p) => p.metadata.id === activeProjectId);

    if (selectedProject) {
      return (
        <ProjectDetailView
          post={selectedProject}
          onBack={() => handleSelectProject(null)}
        />
      );
    }

    // If project ID is invalid or not found
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-6 text-center bg-[#fbf9f5]/90 backdrop-blur-xs rounded-[24px] border border-[#e5e2da] shadow-xs">
        <h2 className="text-2xl font-black text-[#2d3135] mb-3">Project Not Found</h2>
        <p className="font-mono text-[#636870] text-sm mb-6">
          The requested log entry "<span className="text-[#1DB954]">{activeProjectId}</span>" could not be located in the lab records.
        </p>
        <button
          onClick={() => handleSelectProject(null)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#2d3135] text-[#fbf9f5] font-mono text-sm rounded-lg hover:bg-[#1DB954] transition-colors cursor-pointer"
        >
          ← Return to All Projects
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto py-2 flex flex-col items-center">
      {/* Projects List Container */}
      <div className="w-full flex flex-col space-y-[clamp(16px,3vw,32px)] bg-[#fbf9f5]/90 backdrop-blur-xs p-[clamp(16px,3vw,32px)] rounded-[clamp(16px,2.5vw,28px)] border border-[#e5e2da] shadow-xs">
        {projects.map((project, idx) => (
          <React.Fragment key={project.metadata.id}>
            {idx > 0 && <div className="w-full h-[1px] bg-[#e8e5de]" />}
            <a
              href={`/project/${encodeURIComponent(project.metadata.id)}`}
              onClick={(e) => {
                e.preventDefault();
                handleSelectProject(project.metadata.id);
              }}
              className="w-full grid grid-cols-[clamp(80px,18vw,128px)_1fr] gap-[clamp(12px,2.5vw,36px)] items-start group cursor-pointer text-left no-underline"
            >
              {/* Left Thumbnail Column */}
              <div
                className="w-full aspect-square rounded-[clamp(10px,2vw,18px)] flex items-center justify-center shrink-0 shadow-xs overflow-hidden group-hover:shadow-md transition-shadow"
                style={{ backgroundColor: project.metadata.thumbnailBg }}
              >
                <ThumbnailRenderer
                  type={project.metadata.thumbnailType}
                  image={project.metadata.thumbnailImage}
                />
              </div>

              {/* Right Details Column with left border line */}
              <div className="border-l border-[#e2dfd7] pl-[clamp(10px,2vw,36px)] flex flex-col items-start min-w-0">
                {/* Title */}
                <h2 className="text-[clamp(16px,2.5vw,28px)] font-extrabold text-[#282a2d] tracking-tight group-hover:text-[#1DB954] transition-colors mb-2">
                  {project.metadata.title}
                </h2>

                {/* Description */}
                <p className="text-[clamp(11px,1.6vw,15px)] font-mono text-[#5c6068] leading-relaxed mb-3">
                  {project.metadata.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-[clamp(4px,1vw,8px)]">
                  {project.metadata.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-[#c0bdb5] text-[clamp(9px,1.3vw,12px)] font-mono text-[#404348] px-[clamp(6px,1vw,10px)] py-0.5 rounded-xs bg-[#fdfcf9] font-medium select-none"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
