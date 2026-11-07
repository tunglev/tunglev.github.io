import React, { useEffect, useId, useRef, useState } from 'react';

const GROWTH_SPEED = 0.5;
const MAX_RADIUS = 3.5;
const PIXELS_PER_METER = 42;
const OBJECTS = [
  { label: 'A', distance: 1, x: 210, y: 138, labelX: 210, labelY: 110 },
  { label: 'B', distance: 2, x: 126, y: 180, labelX: 126, labelY: 218 },
  { label: 'C', distance: 3, x: 336, y: 180, labelX: 336, labelY: 218 },
];

export function SonificationExplainer() {
  const id = useId();
  const [radius, setRadius] = useState(2.2);
  const [isPlaying, setIsPlaying] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
  }, []);

  function stopScan() {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    setIsPlaying(false);
  }

  function replayScan() {
    stopScan();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRadius(MAX_RADIUS);
      return;
    }

    setRadius(0);
    setIsPlaying(true);
    const startTime = performance.now();
    function animate(now: number) {
      const nextRadius = Math.min(((now - startTime) / 1000) * GROWTH_SPEED, MAX_RADIUS);
      setRadius(nextRadius);
      if (nextRadius < MAX_RADIUS) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        frameRef.current = null;
        setIsPlaying(false);
      }
    }
    frameRef.current = requestAnimationFrame(animate);
  }

  return (
    <figure className="my-7 overflow-hidden rounded-2xl border border-[#e2dfd7] bg-[#f4f1e8]/70">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2dfd7] px-4 py-3 sm:px-5">
        <span className="font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-[#636870]">
          Distance becomes delay
        </span>
        <span className="rounded-full border border-[#b3e6c4] bg-[#eaf7ef] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#137535]">
          t = d / v
        </span>
      </div>

      <div className="px-4 pb-5 sm:px-5">
        <svg
          viewBox="0 0 420 360"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
          className="mx-auto block w-full max-w-[460px]"
        >
          <title id={`${id}-title`}>Growing sphere sonification, viewed from above</title>
          <desc id={`${id}-description`}>
            A listener is surrounded by three illustrative objects, one, two, and three meters away.
            A sphere grows outward at half a meter per second. Each object emits a sound when the sphere
            reaches it, after two, four, and six seconds respectively. The current scan radius is {radius.toFixed(1)} meters.
          </desc>

          <rect x="26" y="22" width="368" height="316" rx="20" fill="#fbf9f5" stroke="#dedbd2" />
          <text x="44" y="47" fill="#777b7f" fontSize="10" fontFamily="monospace" letterSpacing="1.5">
            ROOM / TOP VIEW
          </text>

          {[1, 2, 3].map((distance) => (
            <circle
              key={distance}
              cx="210"
              cy="180"
              r={distance * PIXELS_PER_METER}
              fill="none"
              stroke="#e2dfd7"
              strokeDasharray="3 5"
            />
          ))}

          <circle
            cx="210"
            cy="180"
            r={radius * PIXELS_PER_METER}
            fill="#1DB954"
            fillOpacity="0.07"
            stroke="#1DB954"
            strokeWidth="2"
          />

          {OBJECTS.map((object) => {
            const reached = radius >= object.distance;
            return (
              <g key={object.label}>
                <line
                  x1="210"
                  y1="180"
                  x2={object.x}
                  y2={object.y}
                  stroke={reached ? '#1DB954' : '#c8c6bf'}
                  strokeDasharray="3 4"
                />
                {reached && (
                  <circle cx={object.x} cy={object.y} r="15" fill="#eaf7ef" stroke="#1DB954" />
                )}
                <rect
                  x={object.x - 6}
                  y={object.y - 6}
                  width="12"
                  height="12"
                  rx="3"
                  fill={reached ? '#137535' : '#a4a6a3'}
                />
                <text
                  x={object.labelX}
                  y={object.labelY}
                  textAnchor="middle"
                  fill={reached ? '#137535' : '#636870'}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                >
                  {object.label} / {object.distance} m
                </text>
              </g>
            );
          })}

          <circle cx="210" cy="180" r="15" fill="#282a2d" stroke="#fbf9f5" strokeWidth="3" />
          <path d="M205 182 L210 173 L215 182 Z" fill="#faf8f5" />
          <text x="210" y="251" textAnchor="middle" fill="#636870" fontSize="10" fontFamily="monospace">
            LISTENER
          </text>
          <text x="210" y="313" textAnchor="middle" fill="#636870" fontSize="11" fontFamily="monospace">
            Scan speed: 0.5 m/s
          </text>
        </svg>

        <div className="flex items-baseline justify-between gap-3 font-mono text-xs">
          <label htmlFor={`${id}-radius`} className="font-semibold text-[#282a2d]">Scan radius</label>
          <output htmlFor={`${id}-radius`} className="text-[#137535] tabular-nums">
            {radius.toFixed(1)} m / {(radius / GROWTH_SPEED).toFixed(1)} s
          </output>
        </div>
        <input
          id={`${id}-radius`}
          type="range"
          min="0"
          max={MAX_RADIUS}
          step="0.05"
          value={radius}
          aria-valuetext={`${radius.toFixed(1)} meters, ${(radius / GROWTH_SPEED).toFixed(1)} seconds after the scan begins`}
          aria-describedby={`${id}-instructions`}
          onChange={(event) => {
            stopScan();
            setRadius(Number(event.target.value));
          }}
          className="my-3 block h-6 w-full cursor-pointer accent-[#137535] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#137535]"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p id={`${id}-instructions`} className="m-0 max-w-[240px] font-mono text-[11px] leading-relaxed text-[#636870]">
            Drag the slider. Objects light up when the scan reaches them.
          </p>
          <button
            type="button"
            onClick={replayScan}
            aria-label={isPlaying ? 'Restart the seven-second scan' : 'Replay the seven-second scan'}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-[#282a2d] bg-[#282a2d] px-3 py-2 font-mono text-[11px] font-semibold text-[#fbf9f5] transition-colors hover:bg-[#137535] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#137535]"
          >
            <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
              <path d="M3 1.5 L10 6 L3 10.5 Z" fill="currentColor" />
            </svg>
            Replay scan
          </button>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
          {OBJECTS.map((object) => {
            const reached = radius >= object.distance;
            return (
              <div
                key={object.label}
                className={`min-w-0 rounded-lg border p-2.5 sm:p-3 ${reached ? 'border-[#b3e6c4] bg-[#eaf7ef]' : 'border-[#e2dfd7] bg-[#fbf9f5]'}`}
              >
                <div className="font-mono text-[10px] text-[#636870]">{object.label} / {object.distance} m</div>
                <div className="mt-1 font-mono text-lg font-bold text-[#282a2d]">
                  {object.distance / GROWTH_SPEED}<span className="ml-1 text-xs font-normal">s</span>
                </div>
                <div className={`mt-1 font-mono text-[10px] font-semibold ${reached ? 'text-[#137535]' : 'text-[#636870]'}`}>
                  {reached ? 'Reached' : 'Waiting'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <figcaption className="border-t border-[#e2dfd7] px-4 py-3 font-mono text-[10px] leading-relaxed text-[#636870] sm:px-5">
        Conceptual illustration, not participant data. Distances are illustrative; event delay follows
        distance / scan speed. This diagram does not play audio.
      </figcaption>
    </figure>
  );
}
