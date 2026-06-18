import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Scroll to top on pathname change
    // Or on hash change inside /graphzy
    if (pathname.startsWith('/graphzy')) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    } else if (!hash) {
      // For other pages, only scroll to top if there is no anchor hash
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
      });
    }
  }, [pathname, hash]);

  return null;
}
