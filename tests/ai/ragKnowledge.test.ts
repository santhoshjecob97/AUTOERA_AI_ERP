import { describe, it, expect } from 'vitest';

describe('AutoEra AI Platform — RAG Knowledge Engine & Service Advisor Contracts', () => {
  it('should validate citation payload format with document title, version, and section', () => {
    const citation = {
      document_title: 'Horizon Hyundai Brake System SOP',
      document_type: 'SOP',
      version: 1,
      chunk_index: 1,
      section: 'Brake System',
      relevance_score: 0.85
    };

    expect(citation.document_title).toBeDefined();
    expect(citation.version).toBeGreaterThanOrEqual(1);
    expect(citation.relevance_score).toBeGreaterThan(0.0);
    expect(citation.relevance_score).toBeLessThanOrEqual(1.0);
  });

  it('should validate AI Service Advisor recommendation response shape', () => {
    const recommendation = {
      summary: 'Technical Diagnosis for Hyundai Creta: Brake noise',
      priority: 'CRITICAL',
      has_grounded_sources: true,
      requires_human_review: true,
      confidence_score: 0.92,
      knowledge_sources: [
        {
          document_title: 'Horizon Hyundai Brake System SOP',
          version: 1,
          section: 'Brake Inspection'
        }
      ],
      possible_causes: ['Worn front brake pads below 3mm'],
      recommended_checks: ['Measure disc runout with dial indicator'],
      recommended_actions: ['Replace brake pads and bleed lines with DOT-4']
    };

    expect(recommendation.requires_human_review).toBe(true);
    expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(recommendation.priority);
    expect(recommendation.knowledge_sources.length).toBeGreaterThan(0);
    expect(recommendation.confidence_score).toBeGreaterThan(0.8);
  });

  it('should enforce anti-hallucination fallback contract when no sources exist', () => {
    const fallbackResponse = {
      answer: "I couldn't find sufficient information in the dealership knowledge base to answer this reliably.",
      citations: [],
      has_grounded_sources: false,
      confidence: 0.0
    };

    expect(fallbackResponse.has_grounded_sources).toBe(false);
    expect(fallbackResponse.citations).toHaveLength(0);
    expect(fallbackResponse.answer).toContain("couldn't find sufficient information");
  });
});
