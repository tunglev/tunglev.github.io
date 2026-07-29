import React from 'react';
import { GermanFlag, FrenchFlag, DetectiveDuo } from './Illustrations';

interface ThumbnailRendererProps {
  type?: string;
  image?: string;
}

export function ThumbnailRenderer({ type, image }: ThumbnailRendererProps) {
  const finalImageUrl =
    image ||
    (type &&
    (type.includes('/') ||
      type.includes('.') ||
      type.startsWith('http') ||
      type.startsWith('data:'))
      ? type
      : undefined);

  if (finalImageUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center overflow-hidden">
        <img
          src={finalImageUrl}
          alt="Thumbnail"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  switch (type) {
    case 'german':
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <GermanFlag />
          <div className="w-[60px] sm:w-[82px] h-[38px] sm:h-[50px] rounded-[10px] sm:rounded-[13px] bg-white flex items-center justify-center shadow-xs select-none">
            <span className="text-[#5097f7] text-[20px] sm:text-[28px] font-black tracking-tight leading-none">
              30+
            </span>
          </div>
        </div>
      );
    case 'french':
      return (
        <div className="flex items-center gap-2 sm:gap-3">
          <FrenchFlag />
          <div className="w-[60px] sm:w-[82px] h-[38px] sm:h-[50px] rounded-[10px] sm:rounded-[13px] bg-white flex items-center justify-center shadow-xs select-none">
            <span className="text-[#e8b72e] text-[20px] sm:text-[28px] font-black tracking-tight leading-none">
              30+
            </span>
          </div>
        </div>
      );
    case 'detective':
      return (
        <div className="scale-75 sm:scale-100 transform origin-center flex items-center justify-center">
          <DetectiveDuo />
        </div>
      );
    case 'code':
    default:
      return (
        <div className="w-[60px] sm:w-[82px] h-[38px] sm:h-[50px] rounded-[10px] sm:rounded-[13px] bg-[#282b2e] border border-gray-600/60 flex items-center justify-center shadow-xs select-none">
          <span className="text-[#1DB954] text-[16px] sm:text-[20px] font-mono font-bold tracking-tight">
            &lt;/&gt;
          </span>
        </div>
      );
  }
}
