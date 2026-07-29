import React from 'react';

export type TabId = 'home' | 'experience' | 'project' | 'contact';

export interface NavItem {
  id: TabId;
  label: string;
  key: string;
}

export interface Project {
  id: string;
  thumbnailBg: string;
  thumbnailContent: React.ReactNode;
  title: string;
  description: string;
  tags: string[];
}

export interface SocialLink {
  key: string;
  label: string;
  url: string;
  iconText?: string;
}
