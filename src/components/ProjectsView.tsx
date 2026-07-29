import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, MousePointerClick } from 'lucide-react';
import { getAllProjects, ProjectPost } from '../lib/contentLoader';
import { ProjectDetailView } from './ProjectDetailView';
import { ThumbnailRenderer } from './ThumbnailRenderer';

interface ProjectsViewProps {
  selectedProjectId?: string | null;
  onSelectProject?: (id: string | null) => void;
}

interface ProjectItemRowProps {
  project: ProjectPost;
  isExpanded: boolean;
  isCentered: boolean;
  onSelect: (id: string) => void;
  onExpand: (id: string) => void;
  onCollapse: () => void;
}

function ProjectItemRow({ project, isExpanded, isCentered, onSelect, onExpand, onCollapse }: ProjectItemRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const hasImage = !!(
    project.metadata.thumbnailImage ||
    (project.metadata.thumbnailType &&
      (project.metadata.thumbnailType.includes('/') ||
        project.metadata.thumbnailType.includes('.') ||
        project.metadata.thumbnailType.startsWith('http') ||
        project.metadata.thumbnailType.startsWith('data:')))
  );

  useEffect(() => {
    if (!isExpanded) return;

    const startScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - startScrollY);
      if (diff > 100) { // Let the user scroll 100px before closing
        onCollapse();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          onCollapse();
        }
      },
      {
        threshold: 0.05, // Trigger collapse if it falls below 5% visibility
      }
    );

    const current = containerRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [isExpanded, onCollapse]);

  return (
    <div
      ref={containerRef}
      data-project-id={project.metadata.id}
      className="w-full flex items-start text-left outline-none py-2"
    >
      {/* Left Thumbnail Column with width-expansion click popout */}
      <motion.div
        initial={{ width: 0, marginRight: 0, opacity: 0 }}
        animate={
          isExpanded
            ? {
                width: 'clamp(80px, 18vw, 128px)',
                marginRight: 'clamp(12px, 2.5vw, 36px)',
                opacity: 1,
              }
            : {
                width: 0,
                marginRight: 0,
                opacity: 0,
              }
        }
        transition={{ type: 'spring', stiffness: 220, damping: 26 }}
        className={`aspect-square rounded-[clamp(10px,2vw,18px)] flex items-center justify-center shrink-0 overflow-hidden relative transition-all duration-300 ${
          isExpanded ? 'shadow-md ring-1 ring-[#1DB954]/20' : 'shadow-none'
        }`}
        style={hasImage ? undefined : { backgroundColor: project.metadata.thumbnailBg }}
      >
        <div className={`w-[clamp(80px,18vw,128px)] h-[clamp(80px,18vw,128px)] flex items-center justify-center shrink-0 ${
          hasImage ? 'p-0' : 'p-[clamp(8px,1.5vw,12px)]'
        }`}>
          <ThumbnailRenderer
            type={project.metadata.thumbnailType}
            image={project.metadata.thumbnailImage}
          />
        </div>
      </motion.div>

      {/* Right Details Column, starts anchored left and gets pushed right */}
      <div className="border-l border-[#e2dfd7] pl-[clamp(10px,2vw,36px)] flex flex-col items-start min-w-0 flex-1 min-h-[clamp(80px,18vw,128px)] justify-between">
        <div className="w-full">
          {/* Title */}
          <h2 className="text-[clamp(16px,2.5vw,28px)] font-extrabold text-[#282a2d] tracking-tight mb-2">
            <a
              href={`/project/${encodeURIComponent(project.metadata.id)}`}
              onClick={(e) => {
                e.preventDefault();
                if (isExpanded) {
                  onSelect(project.metadata.id);
                } else {
                  onExpand(project.metadata.id);
                }
              }}
              className="hover:text-[#1DB954] transition-colors cursor-pointer outline-none inline-flex items-center gap-2 group/title"
            >
              <span>{project.metadata.title}</span>
              <MousePointerClick
                size={16}
                className={`${isCentered ? 'text-[#1DB954]' : 'text-[#c0bdb5]'} group-hover/title:text-[#1DB954] transition-colors shrink-0 duration-300`}
              />
            </a>
          </h2>

          {/* Description */}
          <p className="text-[clamp(11px,1.6vw,15px)] font-mono text-[#5c6068] leading-relaxed mb-3">
            {project.metadata.description}
          </p>
        </div>

        {/* Footer info: Tags and Details button */}
        <div className="w-full flex items-center justify-between gap-4 mt-1">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-[clamp(4px,1vw,8px)]">
            {project.metadata.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[#c0bdb5] text-[clamp(9px,1.3vw,12px)] font-mono text-[#404348] px-[clamp(6px,1vw,10px)] py-0.5 rounded-xs bg-[#fdfcf9] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Details Button in Bottom Right Corner */}
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={
              isExpanded
                ? { opacity: 1, x: 0, pointerEvents: 'auto' }
                : { opacity: 0, x: 10, pointerEvents: 'none' }
            }
            transition={{ duration: 0.2 }}
          >
            <a
              href={`/project/${encodeURIComponent(project.metadata.id)}`}
              onClick={(e) => {
                e.preventDefault();
                onSelect(project.metadata.id);
              }}
              className="group flex items-center gap-1.5 text-[clamp(11px,1.4vw,14px)] font-mono font-bold text-[#5c6068] hover:text-[#1DB954] transition-colors shrink-0 select-none cursor-pointer outline-none"
            >
              <span>Details</span>
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function ProjectsView({
  selectedProjectId: externalSelectedProjectId,
  onSelectProject,
}: ProjectsViewProps) {
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState<string | null>(null);
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(null);
  const [scrolledCenteredId, setScrolledCenteredId] = useState<string | null>(null);

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

  useEffect(() => {
    if (activeProjectId) return;

    const handleScroll = () => {
      const elements = document.querySelectorAll('[data-project-id]');
      let closestId: string | null = null;
      let minDistance = Infinity;

      const targetY = window.innerHeight * 0.4; // 40% of viewport height (center to slightly above)

      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const elementCenterY = rect.top + rect.height / 2;
        const distance = Math.abs(elementCenterY - targetY);

        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          if (distance < minDistance) {
            minDistance = distance;
            closestId = el.getAttribute('data-project-id');
          }
        }
      });

      setScrolledCenteredId(closestId);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [activeProjectId, projects]);

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
            <ProjectItemRow
              project={project}
              isExpanded={expandedProjectId === project.metadata.id}
              isCentered={scrolledCenteredId === project.metadata.id}
              onSelect={handleSelectProject}
              onExpand={(id) => setExpandedProjectId(id)}
              onCollapse={() => {
                if (expandedProjectId === project.metadata.id) {
                  setExpandedProjectId(null);
                }
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

