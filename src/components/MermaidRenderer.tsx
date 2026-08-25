import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, Maximize2, Move, AlertCircle } from 'lucide-react';

// Initialize Mermaid with a neutral clean style that matches our laboratory/paper aesthetic
mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono, Courier, monospace',
  themeVariables: {
    fontFamily: 'JetBrains Mono, Courier, monospace',
    primaryColor: '#faf8f5',
    primaryTextColor: '#383b3e',
    primaryBorderColor: '#e5e2da',
    lineColor: '#636870',
    secondaryColor: '#f4f1e8',
    tertiaryColor: '#eaf7ef',
  },
});

interface MermaidRendererProps {
  chart: string;
}

export function MermaidRenderer({ chart }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);
  const touchStartDistRef = useRef<number>(0);
  const touchStartScaleRef = useRef<number>(1);
  const touchStartMidRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState<boolean>(true);

  // Pan & Zoom states
  const [scale, setScale] = useState<number>(1);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dimensions tracking for resetting
  const initialFitRef = useRef<{ scale: number; position: { x: number; y: number } } | null>(null);

  // Generate a unique ID for each mermaid diagram instance
  const uniqueIdRef = useRef<string>(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  // Render Mermaid code to SVG
  useEffect(() => {
    let isMounted = true;
    setIsRendering(true);
    setError(null);

    const renderChart = async () => {
      try {
        // Parse validation to avoid console flooding on syntax errors
        const isValid = await mermaid.parse(chart).catch((err) => {
          throw new Error(err.message || 'Syntax error in Mermaid diagram');
        });

        if (!isValid) {
          throw new Error('Invalid Mermaid syntax');
        }

        const renderId = `svg-${uniqueIdRef.current}`;
        const { svg: renderedSvg } = await mermaid.render(renderId, chart);

        if (isMounted) {
          setSvg(renderedSvg);
          setError(null);
          setIsRendering(false);
        }
      } catch (err: any) {
        console.error('Mermaid rendering failed:', err);
        if (isMounted) {
          setError(err.message || 'Could not parse or render Mermaid diagram');
          setIsRendering(false);
        }
      }
    };

    renderChart();

    return () => {
      isMounted = false;
    };
  }, [chart]);

  // Once SVG is set, fit it to the container and center it
  const handleRecenter = () => {
    if (!svg || !containerRef.current || !svgWrapperRef.current) return;

    const svgEl = svgWrapperRef.current.querySelector('svg');
    if (!svgEl) return;

    // Reset styles on SVG to let us calculate dimensions correctly
    svgEl.setAttribute('width', '100%');
    svgEl.setAttribute('height', '100%');
    svgEl.style.maxWidth = 'none';

    let originalWidth = 600;
    let originalHeight = 400;

    // Get natural dimensions from viewBox
    const viewBox = svgEl.getAttribute('viewBox');
    if (viewBox) {
      const parts = viewBox.split(/\s+/).map(Number);
      if (parts.length === 4) {
        originalWidth = parts[2];
        originalHeight = parts[3];
      }
    } else {
      const bBox = (svgEl as any).getBBox?.();
      if (bBox) {
        originalWidth = bBox.width;
        originalHeight = bBox.height;
      }
    }

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight || 450;

    // Calculate a fit scale with safe padding (15%)
    const scaleX = (containerWidth * 0.85) / originalWidth;
    const scaleY = (containerHeight * 0.85) / originalHeight;
    const fitScale = Math.min(scaleX, scaleY, 1.2); // Cap at 1.2 to avoid pixelation on small SVGs

    // Center coordinates
    const x = (containerWidth - originalWidth * fitScale) / 2;
    const y = (containerHeight - originalHeight * fitScale) / 2;

    const fitConfig = { scale: fitScale, position: { x, y } };
    initialFitRef.current = fitConfig;

    setScale(fitScale);
    setPosition({ x, y });
  };

  // Recenter when SVG changes or container resizes
  useEffect(() => {
    handleRecenter();

    const resizeObserver = new ResizeObserver(() => {
      handleRecenter();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [svg]);

  // Mouse Wheel Zooming (Zoom directly into the cursor coordinates)
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!containerRef.current) return;

    const zoomFactor = 1.08;
    const nextScale = e.deltaY < 0 ? scale * zoomFactor : scale / zoomFactor;
    const boundedScale = Math.max(0.15, Math.min(8, nextScale));

    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - position.x;
    const dy = mouseY - position.y;
    const ratio = boundedScale / scale;

    setPosition({
      x: mouseX - dx * ratio,
      y: mouseY - dy * ratio,
    });
    setScale(boundedScale);
  };

  // Click & Drag Panning
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch Support (Pinch zoom & pan)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      touchStartDistRef.current = dist;
      touchStartScaleRef.current = scale;

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      touchStartMidRef.current = { x: midX, y: midY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y,
      });
    } else if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const ratio = dist / (touchStartDistRef.current || 1);
      const nextScale = Math.max(0.15, Math.min(8, touchStartScaleRef.current * ratio));

      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;

      const rect = containerRef.current.getBoundingClientRect();
      const relativeMidX = midX - rect.left;
      const relativeMidY = midY - rect.top;

      const dx = relativeMidX - position.x;
      const dy = relativeMidY - position.y;
      const scaleRatio = nextScale / scale;

      setPosition({
        x: relativeMidX - dx * scaleRatio,
        y: relativeMidY - dy * scaleRatio,
      });
      setScale(nextScale);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Button-triggered zoom adjustments
  const triggerZoom = (zoomIn: boolean) => {
    if (!containerRef.current) return;
    const factor = zoomIn ? 1.25 : 0.8;
    const nextScale = scale * factor;
    const boundedScale = Math.max(0.15, Math.min(8, nextScale));

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight || 450;
    const midX = containerWidth / 2;
    const midY = containerHeight / 2;

    const dx = midX - position.x;
    const dy = midY - position.y;
    const ratio = boundedScale / scale;

    setPosition({
      x: midX - dx * ratio,
      y: midY - dy * ratio,
    });
    setScale(boundedScale);
  };

  if (error) {
    return (
      <div className="w-full my-6 p-5 bg-red-50/75 border border-red-200/80 rounded-xl flex items-start gap-3 text-red-800">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs font-bold uppercase tracking-wider mb-1">Mermaid Render Error</p>
          <p className="text-sm font-sans mb-3 text-red-700">{error}</p>
          <details className="mt-2 text-xs font-mono bg-red-100/50 p-2.5 rounded border border-red-200 overflow-x-auto select-all max-h-40 no-scrollbar">
            <summary className="cursor-pointer font-bold focus:outline-none mb-1">Show Diagram Source Code</summary>
            {chart}
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-8 border border-[#e5e2da] rounded-2xl overflow-hidden bg-[#faf8f5] shadow-sm select-none relative group/canvas flex flex-col">
      {/* Title / Description Bar */}
      <div className="px-4 py-3 border-b border-[#e5e2da] bg-[#fbf9f5] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1DB954]" />
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#636870]">
            Interactive Flowchart
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#636870]/80">
          <Move className="w-3.5 h-3.5" />
          <span>Drag to pan, Scroll to zoom</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleRecenter}
        className={`w-full h-[380px] md:h-[450px] overflow-hidden relative cursor-grab active:cursor-grabbing bg-radial from-[#ffffff]/50 to-[#fbf9f5]/20 flex items-center justify-center transition-colors duration-150`}
      >
        {isRendering ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#faf8f5]/80 z-20 gap-3">
            <div className="w-6 h-6 border-2 border-[#1DB954]/20 border-t-[#1DB954] rounded-full animate-spin" />
            <span className="text-xs font-mono text-[#636870] tracking-wide animate-pulse">Assembling nodes...</span>
          </div>
        ) : null}

        {/* Zoomed/Panned SVG Canvas */}
        <div
          ref={svgWrapperRef}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: '0 0',
          }}
          className="absolute top-0 left-0 transition-transform duration-75 ease-out select-none"
          dangerouslySetInnerHTML={{ __html: svg }}
        />

        {/* Controls Overlay */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-[#ffffff]/95 backdrop-blur-xs px-2 py-1.5 rounded-lg border border-[#e5e2da] shadow-sm z-10 transition-opacity duration-200">
          {/* Zoom Out */}
          <button
            onClick={() => triggerZoom(false)}
            title="Zoom Out"
            className="p-1.5 hover:bg-[#f4f1e8] text-[#4a4f56] hover:text-[#1DB954] rounded-md transition-all active:scale-95 cursor-pointer focus:outline-none"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          {/* Reset / Center */}
          <button
            onClick={handleRecenter}
            title="Recenter & Fit"
            className="p-1.5 hover:bg-[#f4f1e8] text-[#4a4f56] hover:text-[#1DB954] rounded-md transition-all active:scale-95 cursor-pointer focus:outline-none flex items-center gap-1"
          >
            <Maximize2 className="w-4 h-4" />
            <span className="text-[10px] font-mono font-bold leading-none">FIT</span>
          </button>

          {/* Zoom In */}
          <button
            onClick={() => triggerZoom(true)}
            title="Zoom In"
            className="p-1.5 hover:bg-[#f4f1e8] text-[#4a4f56] hover:text-[#1DB954] rounded-md transition-all active:scale-95 cursor-pointer focus:outline-none"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          {/* Scale Badge */}
          <div className="border-l border-[#e5e2da] pl-2 ml-1 text-[10px] font-mono font-medium text-[#636870]">
            {Math.round(scale * 100)}%
          </div>
        </div>
      </div>
    </div>
  );
}
