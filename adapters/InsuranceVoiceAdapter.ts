import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Insurance Engine Voice Adapter
 * Transforms insurance policy/claim data into voice call context
 */
export class InsuranceVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('insurance');
  }

  /**
   * Transform insurance policy/claim data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming insurance context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'insurance',
      customer,
      context: {
        policyId: data.policyId || data.id,
        policyNumber: data.policyNumber || data.number,
        policyType: data.policyType || data.type,
        coverageAmount: data.coverageAmount || data.coverage,
        premium: data.premium,
        renewalDate: data.renewalDate,
        claimId: data.claimId,
        claimStatus: data.claimStatus,
        claimAmount: data.claimAmount,
        vehicleModel: data.vehicleModel || data.vehicle,
        vehicleNumber: data.vehicleNumber || data.registrationNumber,
        status: data.status,
        lastClaimDate: data.lastClaimDate,
      },
      intents: this.getIntents(),
      metadata: {
        source: 'insurance_engine',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate insurance-focused greeting with policy/claim details
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    
    let contextInfo = '';
    if (ctx.claimId) {
      contextInfo = ` regarding your claim ${ctx.claimId}`;
    } else if (ctx.policyNumber) {
      contextInfo = ` regarding your policy ${ctx.policyNumber}`;
    }

    return this.formatGreeting(
      customer.name,
      `I'm calling from the insurance department${contextInfo}. How can I assist you today?`
    );
  }

  /**
   * Get insurance-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'claim_filing',
      'renewal_inquiry',
      'coverage_check',
      'status_inquiry',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update insurance records
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for insurance', callSession);

    try {
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);

      await this.updateInsuranceRecord(callSession, outcome, notes);
      await this.logInsuranceCall(callSession);

      this.log('Insurance call end handled successfully');
    } catch (error) {
      this.handleError(error, 'handleCallEnd');
    }
  }

  /**
   * Extract call outcome from call session
   */
  private extractCallOutcome(callSession: CallSession): string {
    const transcription = callSession.transcription || [];

    if (transcription.length === 0) {
      return 'no_answer';
    }

    const hasClaim = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('claim') ||
        t.text.toLowerCase().includes('accident')
    );

    if (hasClaim) {
      return 'claim_discussed';
    }

    const hasRenewal = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('renew') ||
        t.text.toLowerCase().includes('renewal')
    );

    if (hasRenewal) {
      return 'renewal_discussed';
    }

    return 'general_inquiry';
  }

  /**
   * Extract call notes from transcription
   */
  private extractCallNotes(callSession: CallSession): string {
    const transcription = callSession.transcription || [];
    if (transcription.length === 0) {
      return 'No transcription available';
    }

    const notes = transcription
      .map((t) => `[${t.speaker}]: ${t.text}`)
      .join('\n');

    return notes.substring(0, 500);
  }

  /**
   * Update insurance record with call information
   */
  private async updateInsuranceRecord(
    callSession: CallSession,
    outcome: string,
    notes: string
  ): Promise<void> {
    this.log('Updating insurance record', {
      policyId: callSession.callId,
      outcome,
    });

    // TODO: Implement actual API call
    // await insuranceAPI.updatePolicy(policyId, { callOutcome: outcome, callNotes: notes });
  }

  /**
   * Log call in insurance history
   */
  private async logInsuranceCall(callSession: CallSession): Promise<void> {
    this.log('Logging insurance call', {
      callId: callSession.callId,
      duration: callSession.duration,
    });

    // TODO: Implement actual API call
    // await insuranceAPI.logCall(callSession);
  }
}
