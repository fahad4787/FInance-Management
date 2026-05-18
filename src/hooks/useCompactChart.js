import { useEffect, useState } from 'react';

const COMPACT_MEDIA = '(max-width: 639px)';

export const useCompactChart = () => {
  const [compact, setCompact] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(COMPACT_MEDIA).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(COMPACT_MEDIA);
    const sync = (e) => setCompact(e.matches);
    setCompact(mq.matches);
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return compact;
};
