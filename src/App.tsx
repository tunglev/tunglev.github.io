/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavItem } from './types';
import { TypewriterTransition } from './components/TypewriterTransition';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { ProjectsView } from './components/ProjectsView';
import { ExperienceView } from './components/ExperienceView';
import { ContactView } from './components/ContactView';
import { BinaryBackground } from './components/BinaryBackground';
import { MobileWarningOverlay } from './components/MobileWarningOverlay';
import { useRouter } from './lib/router';

export default function App() {
  const { route, navigateTab, navigateProject } = useRouter();
  const activeTab = route.tab;
  const selectedProjectId = route.projectId;

  // Scroll to top of the page whenever route tab or project changes
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [route.tab, route.projectId]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent shortcut if user is typing in an input or textarea
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'h') navigateTab('home');
      if (key === 'p') navigateTab('project');
      if (key === 'e') navigateTab('experience');
      if (key === 'i') navigateTab('contact');

      // Social shortcuts
      if (key === 'l') window.open('https://www.linkedin.com/in/tungvle', '_blank');
      if (key === 'g') window.open('https://github.com/tunglev', '_blank');
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigateTab]);

  const navItems: NavItem[] = [
    { id: 'home', label: 'HOME', key: 'h' },
    { id: 'project', label: 'PROJECTS', key: 'p' },
    { id: 'contact', label: 'CONTACT', key: 'i' },
  ];

  const viewKey = `${activeTab}-${selectedProjectId || 'main'}`;

  return (
    <div className="relative min-h-screen bg-[#faf8f5] text-[#383b3e] flex flex-col justify-between items-center w-full max-w-full">
      {/* Mobile Desktop Warning Overlay */}
      <MobileWarningOverlay />

      {/* Dynamic Interactive Binary Canvas Background */}
      <BinaryBackground radius={130} baseOpacity={0.07} activeOpacity={0.4} />

      {/* Header Navigation - Sticky Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={navigateTab}
        navItems={navItems}
      />

      {/* Main Content View with Page Transition Animations */}
      <main className="relative z-10 flex-1 w-full max-w-5xl mx-auto px-[clamp(16px,4vw,32px)] py-[clamp(24px,5vw,64px)] flex flex-col justify-center items-center">
        <TypewriterTransition viewKey={viewKey} tabName={selectedProjectId ? `${activeTab}/${selectedProjectId}` : activeTab}>
          {activeTab === 'project' && (
            <ProjectsView
              selectedProjectId={selectedProjectId}
              onSelectProject={navigateProject}
            />
          )}
          {activeTab === 'home' && <HomeView />}
          {activeTab === 'experience' && <ExperienceView />}
          {activeTab === 'contact' && <ContactView />}
        </TypewriterTransition>
      </main>

      {/* Footer on Every Page */}
      <div className="relative z-10 w-full">
        <Footer />
      </div>
    </div>
  );
}
