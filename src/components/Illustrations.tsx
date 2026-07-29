import React from 'react';

// German Flag Badge Component
export function GermanFlag() {
  return (
    <div className="w-[82px] h-[50px] rounded-[13px] overflow-hidden flex flex-col shadow-xs select-none">
      <div className="h-1/3 bg-[#1d1d1b] w-full" />
      <div className="h-1/3 bg-[#dd1f26] w-full" />
      <div className="h-1/3 bg-[#fdb913] w-full" />
    </div>
  );
}

// French Flag Badge Component
export function FrenchFlag() {
  return (
    <div className="w-[82px] h-[50px] rounded-[13px] overflow-hidden flex flex-row shadow-xs select-none">
      <div className="w-1/3 bg-[#002395] h-full" />
      <div className="w-1/3 bg-[#ffffff] h-full" />
      <div className="w-1/3 bg-[#ed2939] h-full" />
    </div>
  );
}

// Detective Duo Owl Vector Illustration
export function DetectiveDuo() {
  return (
    <svg
      width="135"
      height="115"
      viewBox="0 0 135 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="select-none"
    >
      {/* Ground Shadow */}
      <ellipse cx="65" cy="100" rx="34" ry="4.5" fill="#e2de78" opacity="0.9" />

      {/* Feet walking/striding right */}
      <path
        d="M 44 92 C 40 95 38 98 42 100 C 46 100 50 96 49 93 Z"
        fill="#ff9600"
      />
      <path
        d="M 68 93 C 70 97 74 100 78 98 C 80 96 76 93 72 92 Z"
        fill="#ff9600"
      />

      {/* Duo Green Body Base */}
      <path
        d="M 40 52 C 38 36 48 24 64 24 C 80 24 88 36 86 52 C 85 70 80 88 64 88 C 48 88 41 70 40 52 Z"
        fill="#78c800"
      />

      {/* Light Green Belly Patch */}
      <path
        d="M 50 64 C 50 54 56 46 64 46 C 72 46 78 54 78 64 C 78 74 72 82 64 82 C 56 82 50 74 50 64 Z"
        fill="#8ee000"
      />

      {/* White Shirt Collar & Dark Tie */}
      <path d="M 59 46 L 69 46 L 66 60 L 64 64 L 62 60 Z" fill="#2b2d32" />
      <path d="M 57 44 L 64 51 L 60 44 Z" fill="#ffffff" />
      <path d="M 71 44 L 64 51 L 68 44 Z" fill="#ffffff" />

      {/* Trench Coat Body */}
      <path
        d="M 37 54 C 36 62 40 85 46 87 C 55 89 73 89 80 86 C 84 83 85 62 83 54 C 77 52 70 50 64 50 C 58 50 43 52 37 54 Z"
        fill="#bd8651"
      />

      {/* Trench Coat Lapels / Collar */}
      <path d="M 39 53 L 53 53 L 47 66 Z" fill="#a46d3a" />
      <path d="M 81 53 L 67 53 L 73 66 Z" fill="#a46d3a" />

      {/* Coat Belt Line */}
      <path
        d="M 43 73 C 53 75 73 75 81 72"
        stroke="#8d5626"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Eyes */}
      <circle cx="54" cy="40" r="8" fill="#ffffff" />
      <circle cx="56" cy="40" r="4.5" fill="#1b2838" />
      <circle cx="57.5" cy="38" r="1.5" fill="#ffffff" />

      <circle cx="71" cy="40" r="8" fill="#ffffff" />
      <circle cx="73" cy="40" r="4.5" fill="#1b2838" />
      <circle cx="74.5" cy="38" r="1.5" fill="#ffffff" />

      {/* Beak */}
      <path
        d="M 60 42 C 60 42 63 48 64 48 C 65 48 68 42 68 42 Z"
        fill="#ff9600"
      />

      {/* Detective Fedora Hat */}
      <path
        d="M 44 26 C 45 13 54 9 65 10 C 74 11 80 18 80 27 Z"
        fill="#bd8651"
      />
      <path
        d="M 43 25 C 51 24 73 25 80 27 C 80 29 78 31 78 31 C 72 29 49 28 43 29 Z"
        fill="#5a381c"
      />
      <path
        d="M 31 29 C 45 25 78 27 91 32 C 92 34 86 36 80 35 C 66 33 41 32 32 32 C 29 32 30 30 31 29 Z"
        fill="#a46d3a"
      />

      {/* Sleeves */}
      <path
        d="M 37 58 C 35 64 38 72 42 72 C 44 72 45 66 42 58 Z"
        fill="#a46d3a"
      />
      <path
        d="M 78 58 C 83 58 91 64 93 68 C 93 70 89 72 84 68 C 81 65 78 62 78 58 Z"
        fill="#a46d3a"
      />

      {/* Magnifying Glass */}
      <path
        d="M 90 70 L 102 82"
        stroke="#3a414d"
        strokeWidth="4.5"
        strokeLinecap="round"
      />
      <circle
        cx="103"
        cy="66"
        r="13"
        fill="none"
        stroke="#8a95a5"
        strokeWidth="4"
      />
      <circle cx="103" cy="66" r="11" fill="#bde0fe" fillOpacity="0.45" />
      <path
        d="M 97 61 C 99 57 105 56 109 58"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
