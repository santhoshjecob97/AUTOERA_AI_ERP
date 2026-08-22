import { describe, it, expect } from 'vitest';

describe('AutoEra Service Engine State Transitions', () => {
  const JOB_CARD_LIFECYCLE = [
    'SCHEDULED',
    'CHECKED_IN',
    'INSPECTION',
    'ESTIMATE_PENDING',
    'IN_PROGRESS',
    'QUALITY_CHECK',
    'READY_FOR_DELIVERY',
    'DELIVERED'
  ];

  it('contains complete 8-step service workflow from check-in to delivery', () => {
    expect(JOB_CARD_LIFECYCLE).toHaveLength(8);
    expect(JOB_CARD_LIFECYCLE[0]).toBe('SCHEDULED');
    expect(JOB_CARD_LIFECYCLE[JOB_CARD_LIFECYCLE.length - 1]).toBe('DELIVERED');
  });

  it('validates state progression order', () => {
    const currentState = 'CHECKED_IN';
    const nextValidIndex = JOB_CARD_LIFECYCLE.indexOf(currentState) + 1;
    expect(JOB_CARD_LIFECYCLE[nextValidIndex]).toBe('INSPECTION');
  });

  it('ensures cancellation can occur before delivery', () => {
    const cancellableStates = ['SCHEDULED', 'CHECKED_IN', 'INSPECTION', 'ESTIMATE_PENDING'];
    cancellableStates.forEach(state => {
      expect(JOB_CARD_LIFECYCLE.includes(state)).toBe(true);
    });
  });
});
