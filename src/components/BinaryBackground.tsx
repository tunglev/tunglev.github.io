import React, { useEffect, useRef } from 'react';

interface BinaryBackgroundProps {
  /** Grid cell font size in pixels */
  fontSize?: number;
  /** Radius in pixels around mouse where bits flip */
  radius?: number;
  /** Base opacity for binary text outside mouse radius */
  baseOpacity?: number;
  /** Active opacity for binary text inside mouse radius */
  activeOpacity?: number;
}

export const BinaryBackground: React.FC<BinaryBackgroundProps> = ({
  fontSize = 13,
  radius = 120,
  baseOpacity = 0.07,
  activeOpacity = 0.38,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    // Grid layout parameters
    const cellWidth = Math.round(fontSize * 1.3);
    const cellHeight = Math.round(fontSize * 1.6);
    let cols = 0;
    let rows = 0;
    let baseBits: Uint8Array = new Uint8Array(0);

    // Track mouse position relative to viewport
    const mouse = {
      x: -1000,
      y: -1000,
      active: false,
    };

    const initGrid = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);

      cols = Math.ceil(width / cellWidth) + 1;
      rows = Math.ceil(height / cellHeight) + 1;

      // Random initial 0s and 1s
      baseBits = new Uint8Array(cols * rows);
      for (let i = 0; i < baseBits.length; i++) {
        baseBits[i] = Math.random() < 0.5 ? 0 : 1;
      }
    };

    initGrid();

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('resize', initGrid);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);

    // Frame counters for subtle ambient bit flips
    let tick = 0;
    const radiusSq = radius * radius;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      ctx.font = `${fontSize}px "JetBrains Mono", "Space Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Occasionally flip a tiny random set of ambient background bits (1 in 1500 per frame)
      if (tick % 6 === 0) {
        const randomIndex = Math.floor(Math.random() * baseBits.length);
        baseBits[randomIndex] ^= 1;
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const cellX = c * cellWidth + cellWidth / 2;
          const cellY = r * cellHeight + cellHeight / 2;

          const dx = cellX - mouse.x;
          const dy = cellY - mouse.y;
          const distSq = dx * dx + dy * dy;

          const baseBit = baseBits[idx];
          let displayBit = baseBit;
          let alpha = baseOpacity;
          let isFlipped = false;

          if (mouse.active && distSq < radiusSq) {
            isFlipped = true;
            // Flip the binary bit (0 -> 1, 1 -> 0) inside mouse radius
            displayBit = baseBit ^ 1;

            const dist = Math.sqrt(distSq);
            const proximity = 1 - dist / radius; // 0 at edge, 1 at center
            
            // Brighten slightly inside radius for feedback
            alpha = baseOpacity + proximity * (activeOpacity - baseOpacity);
          }

          // Color selection: #1DB954 accent tone
          if (isFlipped) {
            // Bright vibrant green accent when flipped near cursor
            ctx.fillStyle = `rgba(30, 215, 96, ${alpha.toFixed(3)})`;
          } else {
            // Muted ambient green tone
            ctx.fillStyle = `rgba(29, 185, 84, ${alpha.toFixed(3)})`;
          }

          ctx.fillText(displayBit.toString(), cellX, cellY);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initGrid);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [fontSize, radius, baseOpacity, activeOpacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 select-none"
      aria-hidden="true"
    />
  );
};
