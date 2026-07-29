import { useState, useEffect, useCallback } from 'react';
import { TabId } from '../types';

export interface RouteState {
  tab: TabId;
  projectId: string | null;
}

/**
 * Parses a given pathname into a RouteState.
 * Handled routes:
 * - / or /home -> { tab: 'home', projectId: null }
 * - /experience -> { tab: 'experience', projectId: null }
 * - /contact -> { tab: 'contact', projectId: null }
 * - /project or /projects -> { tab: 'project', projectId: null }
 * - /project/:id or /projects/:id -> { tab: 'project', projectId: :id }
 */
export function parsePath(pathname: string): RouteState {
  // Normalize pathname by removing trailing slash if not root
  const cleanPath = pathname.length > 1 && pathname.endsWith('/')
    ? pathname.slice(0, -1)
    : pathname;

  if (cleanPath === '' || cleanPath === '/' || cleanPath === '/home') {
    return { tab: 'home', projectId: null };
  }

  if (cleanPath === '/experience') {
    return { tab: 'experience', projectId: null };
  }

  if (cleanPath === '/contact') {
    return { tab: 'contact', projectId: null };
  }

  if (cleanPath === '/project' || cleanPath === '/projects') {
    return { tab: 'project', projectId: null };
  }

  if (cleanPath.startsWith('/project/') || cleanPath.startsWith('/projects/')) {
    const parts = cleanPath.split('/').filter(Boolean);
    const id = parts[1] ? decodeURIComponent(parts[1]) : null;
    return { tab: 'project', projectId: id };
  }

  // Fallback default
  return { tab: 'home', projectId: null };
}

/**
 * Returns the URL path for a given tab and optional projectId.
 */
export function getPathForRoute(tab: TabId, projectId?: string | null): string {
  if (tab === 'home') return '/home';
  if (tab === 'experience') return '/experience';
  if (tab === 'contact') return '/contact';
  if (tab === 'project') {
    if (projectId) {
      return `/project/${encodeURIComponent(projectId)}`;
    }
    return '/project';
  }
  return '/home';
}

export function useRouter() {
  const [route, setRoute] = useState<RouteState>(() => parsePath(window.location.pathname));

  useEffect(() => {
    const handlePopState = () => {
      setRoute(parsePath(window.location.pathname));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(parsePath(path));
    window.scrollTo(0, 0);
  }, []);

  const navigateTab = useCallback((tab: TabId) => {
    const path = getPathForRoute(tab);
    navigate(path);
  }, [navigate]);

  const navigateProject = useCallback((projectId: string | null) => {
    const path = getPathForRoute('project', projectId);
    navigate(path);
  }, [navigate]);

  return {
    route,
    navigate,
    navigateTab,
    navigateProject,
  };
}
