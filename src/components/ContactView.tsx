import React from 'react';

export function ContactView() {
  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-8 flex flex-col items-center text-center">
      <h1 className="text-[clamp(24px,4.5vw,48px)] font-extrabold text-[#2d3135] tracking-tight mb-[clamp(10px,2vw,20px)]">
        Contact
      </h1>
      <p className="text-[clamp(12px,1.6vw,16px)] text-[#636870] font-mono leading-relaxed mb-[clamp(16px,2.5vw,28px)] max-w-xl">
        Get in touch for engineering inquiries, collaborations, or hardware/software architectural discussions.
      </p>
      <div className="w-full max-w-md py-[clamp(12px,2vw,24px)] rounded-lg font-mono text-[clamp(12px,1.5vw,14px)] text-[#383b3e] space-y-2 text-center">
        <p><span className="text-[#1DB954] font-bold">[email]</span> contact@example.com</p>
        <p><span className="text-[#1DB954] font-bold">[location]</span> San Francisco, CA</p>
      </div>
    </div>
  );
}
