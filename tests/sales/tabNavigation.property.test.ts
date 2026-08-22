import { describe, it, expect } from 'vitest';

describe('Sales Tab Navigation State Management', () => {
  class TabManager {
    private state: Record<string, any> = {};
    private currentTab: string = 'overview';

    navigate(tab: string, stateUpdate?: Record<string, any>) {
      this.currentTab = tab;
      if (stateUpdate) {
        this.state[tab] = { ...this.state[tab], ...stateUpdate };
      }
    }

    getTabState(tab: string) {
      return this.state[tab] || {};
    }

    getCurrentTab() {
      return this.currentTab;
    }
  }

  it('preserves tab filter state when navigating across multiple tabs and returning', () => {
    const manager = new TabManager();
    manager.navigate('leads', { filter: 'HOT', search: 'Creta' });
    expect(manager.getCurrentTab()).toBe('leads');

    manager.navigate('quotations', { status: 'DRAFT' });
    expect(manager.getCurrentTab()).toBe('quotations');

    manager.navigate('leads');
    expect(manager.getCurrentTab()).toBe('leads');
    expect(manager.getTabState('leads')).toEqual({ filter: 'HOT', search: 'Creta' });
    expect(manager.getTabState('quotations')).toEqual({ status: 'DRAFT' });
  });
});
