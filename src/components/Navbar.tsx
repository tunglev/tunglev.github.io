import React from 'react';
import { motion } from 'motion/react';
import { NavItem, TabId } from '../types';
import { getPathForRoute } from '../lib/router';

interface NavbarProps {
  activeTab: TabId;
  onSelectTab: (tab: TabId) => void;
  navItems: NavItem[];
}

export function Navbar({ activeTab, onSelectTab, navItems }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#f7f5f0]/90 backdrop-blur-md py-[clamp(12px,2vw,28px)] px-4 flex justify-center items-center select-none border-b border-[#e8e5de]/80">
      <nav className="flex items-center justify-center gap-[clamp(12px,3vw,48px)] font-mono max-w-full">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const href = getPathForRoute(item.id);
          return (
            <a
              key={item.id}
              href={href}
              onClick={(e) => {
                e.preventDefault();
                onSelectTab(item.id);
              }}
              className="relative pb-1.5 flex items-center gap-[clamp(4px,1vw,10px)] cursor-pointer transition-colors focus:outline-none shrink-0"
            >
              <span className="text-[#1DB954] text-[clamp(12px,1.8vw,16px)] tracking-normal font-mono">
                [{item.key}]
              </span>
              <span
                className={`text-[clamp(12px,1.8vw,16px)] font-mono tracking-wider uppercase font-medium transition-colors ${
                  isActive ? 'text-[#1DB954]' : 'text-[#4e535a] hover:text-[#282b2e]'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#1DB954] rounded-full"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
            </a>
          );
        })}
      </nav>
    </header>
  );
}
