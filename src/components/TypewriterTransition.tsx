import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface TypewriterTransitionProps {
  children: React.ReactNode;
  viewKey: string;
  tabName: string;
}

export function TypewriterTransition({ children, viewKey, tabName }: TypewriterTransitionProps) {
  const [typedCommand, setTypedCommand] = useState('');
  const fullCommand = `$ cat /sys/logs/${tabName}.md`;

  useEffect(() => {
    setTypedCommand('');
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullCommand.length) {
        setTypedCommand(fullCommand.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 18);

    return () => clearInterval(interval);
  }, [viewKey, tabName]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full flex flex-col items-center justify-center relative"
      >
        {/* Terminal Typewriter Header Command */}
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.12 }}
          className="w-full font-mono text-xs text-[#1DB954] mb-4 flex items-center justify-between bg-[#1e2220] px-3.5 py-2 rounded-lg border border-[#1DB954]/30 shadow-xs select-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#1DB954] font-bold">›</span>
            <span className="tracking-wide text-gray-200">{typedCommand}</span>
            <span className="inline-block w-2 h-3.5 bg-[#1DB954] animate-pulse" />
          </div>
          <span className="text-[10px] text-gray-400 font-mono hidden sm:inline-block uppercase tracking-widest">
            TTY_01 // READY
          </span>
        </motion.div>

        {/* Content with Stepped Typewriter Reveal */}
        <motion.div
          variants={{
            initial: {
              clipPath: 'inset(0 100% 0 0)',
              opacity: 0,
            },
            animate: {
              clipPath: 'inset(0 0% 0 0)',
              opacity: 1,
              transition: {
                clipPath: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] },
                opacity: { duration: 0.15 },
              },
            },
            exit: {
              clipPath: 'inset(0 100% 0 0)',
              opacity: 0,
              transition: {
                clipPath: { duration: 0.22, ease: 'easeIn' },
                opacity: { duration: 0.15 },
              },
            },
          }}
          className="w-full flex flex-col items-center justify-center relative overflow-hidden"
        >
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
