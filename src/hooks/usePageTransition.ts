'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function usePageTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousPath, setPreviousPath] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    if (previousPath && previousPath !== pathname) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 600); // Match transition duration

      return () => clearTimeout(timer);
    }
    setPreviousPath(pathname);
  }, [pathname, previousPath]);

  return { isTransitioning, previousPath, currentPath: pathname };
}
