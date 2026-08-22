import { useState, useEffect, useCallback } from 'react';
import { EngineType } from '../types/dashboard';

const STORAGE_KEY_PREFIX = 'autoera_dashboard_expanded_';

interface UseDashboardToggleOptions {
  engineType: EngineType;
  defaultExpanded?: boolean;
}

interface UseDashboardToggleReturn {
  isExpanded: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  setExpanded: (expanded: boolean) => void;
}

export function useDashboardToggle(
  options: UseDashboardToggleOptions
): UseDashboardToggleReturn {
  const { engineType, defaultExpanded = true } = options;
  const storageKey = `${STORAGE_KEY_PREFIX}${engineType}`;

  const [isExpanded, setIsExpandedState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) {
        return JSON.parse(stored);
      }
    } catch {
      // localStorage unavailable or invalid JSON
    }
    return defaultExpanded;
  });

  // Persist to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(isExpanded));
    } catch {
      // localStorage unavailable, continue with in-memory state
      console.warn('Unable to persist dashboard toggle state to localStorage');
    }
  }, [isExpanded, storageKey]);

  const toggle = useCallback(() => {
    setIsExpandedState(prev => !prev);
  }, []);

  const expand = useCallback(() => {
    setIsExpandedState(true);
  }, []);

  const collapse = useCallback(() => {
    setIsExpandedState(false);
  }, []);

  const setExpanded = useCallback((expanded: boolean) => {
    setIsExpandedState(expanded);
  }, []);

  return {
    isExpanded,
    toggle,
    expand,
    collapse,
    setExpanded,
  };
}

export default useDashboardToggle;
