import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const NavigationContext = createContext(null);

export function normalizePath(path = '') {
  const clean = path.split('#')[0].split('?')[0];
  const normalized = clean.replace(/\/+$/, '') || '/';
  return normalized;
}

export function NavigationProvider({ children }) {
  const [currentPath, setCurrentPath] = useState(() => normalizePath(window.location.pathname));
  const [currentHash, setCurrentHash] = useState(() => window.location.hash);

  const scrollToHash = useCallback((hash) => {
    if (!hash || hash === '#' || hash === '#home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const target = document.querySelector(hash);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const navigate = useCallback((to) => {
    if (!to) return;

    // Check for mailto/external
    if (to.startsWith('mailto:') || to.startsWith('tel:') || to.startsWith('http://') || to.startsWith('https://')) {
      const isInternal = to.startsWith(window.location.origin);
      if (!isInternal) {
        window.location.href = to;
        return;
      }
      to = to.replace(window.location.origin, '');
    }

    const [targetPathPart, targetHashPart] = to.split('#');
    const targetPath = normalizePath(targetPathPart || currentPath);
    const targetHash = targetHashPart ? `#${targetHashPart}` : '';

    const isSamePath = targetPath === currentPath;

    if (isSamePath) {
      if (targetHash) {
        window.history.pushState(null, '', `${targetPathPart || window.location.pathname}${targetHash}`);
        setCurrentHash(targetHash);
        scrollToHash(targetHash);
      } else {
        window.history.pushState(null, '', targetPath);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // Navigating to new path
    window.history.pushState(null, '', to);
    setCurrentPath(targetPath);
    setCurrentHash(targetHash);

    // Scroll to top or schedule hash scroll
    if (targetHash) {
      setTimeout(() => {
        scrollToHash(targetHash);
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentPath, scrollToHash]);

  useEffect(() => {
    const handlePopState = () => {
      const nextPath = normalizePath(window.location.pathname);
      const nextHash = window.location.hash;
      setCurrentPath(nextPath);
      setCurrentHash(nextHash);
      if (nextHash) {
        scrollToHash(nextHash);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [scrollToHash]);

  // Intercept click on internal links globally
  useEffect(() => {
    const handleGlobalClick = (event) => {
      const anchor = event.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore ctrl/cmd/shift/meta clicks or target="_blank"
      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        anchor.target === '_blank' ||
        anchor.hasAttribute('download')
      ) {
        return;
      }

      // External or special protocols
      if (href.startsWith('mailto:') || href.startsWith('tel:')) return;
      if (href.startsWith('http://') || href.startsWith('https://')) {
        if (!href.startsWith(window.location.origin)) return;
      }

      event.preventDefault();
      navigate(href);
    };

    document.addEventListener('click', handleGlobalClick);
    return () => document.removeEventListener('click', handleGlobalClick);
  }, [navigate]);

  return (
    <NavigationContext.Provider value={{ currentPath, currentHash, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
