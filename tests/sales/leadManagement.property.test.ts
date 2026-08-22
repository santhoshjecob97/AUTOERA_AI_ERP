import { describe, it, expect } from 'vitest';

describe('Lead Management & AI Score Categorization', () => {
  function getLeadCategory(score: number): 'HOT' | 'WARM' | 'COOL' | 'COLD' {
    if (score >= 85) return 'HOT';
    if (score >= 60) return 'WARM';
    if (score >= 40) return 'COOL';
    return 'COLD';
  }

  it('categorizes leads with scores >= 85 as HOT', () => {
    expect(getLeadCategory(95)).toBe('HOT');
    expect(getLeadCategory(85)).toBe('HOT');
  });

  it('categorizes leads with scores 60-84 as WARM', () => {
    expect(getLeadCategory(75)).toBe('WARM');
    expect(getLeadCategory(60)).toBe('WARM');
  });

  it('categorizes leads with scores 40-59 as COOL', () => {
    expect(getLeadCategory(50)).toBe('COOL');
    expect(getLeadCategory(40)).toBe('COOL');
  });

  it('categorizes leads with scores < 40 as COLD', () => {
    expect(getLeadCategory(30)).toBe('COLD');
    expect(getLeadCategory(0)).toBe('COLD');
  });

  it('filters leads list accurately by category', () => {
    const leads = [
      { id: '1', name: 'Lead A', score: 90 },
      { id: '2', name: 'Lead B', score: 70 },
      { id: '3', name: 'Lead C', score: 30 },
    ];
    const hotLeads = leads.filter(l => getLeadCategory(l.score) === 'HOT');
    expect(hotLeads).toHaveLength(1);
    expect(hotLeads[0].name).toBe('Lead A');
  });
});
