import { describe, it, expect } from 'vitest';

export interface ActionProposalContract {
  id: string;
  agent_name: string;
  tool_name: string;
  parameters_json: Record<string, any>;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  reason: string;
  expected_effect: string;
  status: 'PROPOSED' | 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'EXECUTED' | 'FAILED' | 'EXPIRED';
}

export interface CopilotChatResponseContract {
  agent: string;
  response: string;
  tool_executions: string[];
  action_proposals: Array<{
    status: string;
    proposal_id: string;
    risk_level: string;
    message: string;
  }>;
  citations: Array<{
    document_title: string;
    version: number;
    section: string;
    relevance_score: number;
  }>;
  requires_human_approval: boolean;
  provider: string;
  model: string;
  latency_ms: number;
  status: string;
}

describe('Stage 6C Frontend AI Copilot & Agent Orchestration Contracts', () => {
  it('correctly models CopilotChatResponse contract with multi-tool execution', () => {
    const mockResponse: CopilotChatResponseContract = {
      agent: 'Service Advisor Agent',
      response: 'Customer Ananya Roy (9876543210) has 15 Tucson brake pads in stock.',
      tool_executions: ['get_customer', 'get_parts_availability'],
      action_proposals: [],
      citations: [
        {
          document_title: 'Horizon Tucson Service SOP',
          version: 1,
          section: 'Tucson Brake Service',
          relevance_score: 0.88,
        },
      ],
      requires_human_approval: false,
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      latency_ms: 45,
      status: 'SUCCESS',
    };

    expect(mockResponse.agent).toBe('Service Advisor Agent');
    expect(mockResponse.tool_executions).toContain('get_customer');
    expect(mockResponse.tool_executions).toContain('get_parts_availability');
    expect(mockResponse.requires_human_approval).toBe(false);
    expect(mockResponse.citations.length).toBe(1);
  });

  it('correctly models High-Risk ActionProposal contract requiring human approval', () => {
    const mockProposal: ActionProposalContract = {
      id: 'prop-8877-uuid',
      agent_name: 'Finance Assistant',
      tool_name: 'issue_refund',
      parameters_json: { invoice_id: 'INV-1001', amount: '5000' },
      risk_level: 'CRITICAL',
      reason: 'Customer goodwill refund on service delay',
      expected_effect: 'Issue refund of Rs. 5000',
      status: 'PENDING_APPROVAL',
    };

    expect(mockProposal.risk_level).toBe('CRITICAL');
    expect(mockProposal.status).toBe('PENDING_APPROVAL');
    expect(mockProposal.parameters_json.amount).toBe('5000');
  });
});
