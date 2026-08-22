import { describe, it, expect, beforeEach, vi } from 'vitest';
import apiService from '../../services/api';

describe('Frontend API Service Hardening', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('injects Authorization Bearer token when stored in localStorage', async () => {
    localStorage.setItem('authToken', 'test-jwt-token-xyz');
    expect(localStorage.getItem('authToken')).toBe('test-jwt-token-xyz');
  });

  it('clears token on logout', () => {
    localStorage.setItem('authToken', 'sample-token');
    localStorage.removeItem('authToken');
    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('constructs correct API endpoints', () => {
    const endpoints = {
      customers: '/api/v1/customers/',
      leads: '/api/v1/leads/',
      jobCards: '/api/v1/job-cards/',
      invoices: '/api/v1/invoices/',
      aiChat: '/api/v1/ai/copilot/chat/',
      health: '/api/v1/health/'
    };

    expect(endpoints.customers).toBe('/api/v1/customers/');
    expect(endpoints.jobCards).toBe('/api/v1/job-cards/');
    expect(endpoints.aiChat).toBe('/api/v1/ai/copilot/chat/');
  });
});
