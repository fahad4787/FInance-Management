import { useMemo } from 'react';

/**
 * Returns sorted unique client (broker) names from projects for dropdowns.
 */
export const useClientOptions = (projects = []) => {
  return useMemo(() => {
    const clients = (projects || [])
      .map((p) => p.client)
      .filter(Boolean)
      .map((c) => String(c).trim())
      .filter(Boolean);
    return [...new Set(clients)].sort();
  }, [projects]);
};
