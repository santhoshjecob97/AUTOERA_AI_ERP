import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Sales Engine Voice Adapter
 * Transforms lead data into voice call context
 */
export class SalesVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('sales');
  }

  /**
   * Transform lead data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming sales context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'sales',
      customer,
      context: {
        leadId: data.leadId || data.id,
        leadSource: data.leadSource || data.source,
        leadScore: data.leadScore || data.score,
        interestedVehicle: data.interestedVehicle || data.vehicle,
        budget: data.budget,
        preferredModel: data.preferredModel || data.model,
        testDriveScheduled: data.testDriveScheduled,
        lastContactDate: data.lastContactDate,
        salesRep: data.salesRep || data.assignedTo,
        status: data.status,
        notes: data.notes,
      },
      intents: this.getIntents(),
      metadata: {
        source: 'sales_engine',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate sales-focused greeting with vehicle preferences
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    const vehicleInfo = ctx.interestedVehicle
      ? ` regarding the ${ctx.interestedVehicle}`
      : '';

    return this.formatGreeting(
      customer.name,
      `I'm calling from the sales department${vehicleInfo}. I'd love to discuss how we can help you find your perfect vehicle.`
    );
  }

  /**
   * Get sales-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'lead_qualification',
      'test_drive_booking',
      'inventory_inquiry',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update CRM records
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for sales', callSession);

    try {
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);
      const leadScore = this.calculateLeadScore(callSession);

      await this.updateCRMRecord(callSession, outcome, notes, leadScore);
      await this.logSalesCall(callSession);

      this.log('Sales call end handled successfully');
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

    const hasTestDrive = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('test drive') ||
        t.text.toLowerCase().includes('schedule')
    );

    if (hasTestDrive) {
      return 'test_drive_scheduled';
    }

    const hasInterest = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('interested') ||
        t.text.toLowerCase().includes('like to know')
    );

    if (hasInterest) {
      return 'interested';
    }

    return 'follow_up_required';
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
   * Calculate lead score based on call interaction
   */
  private calculateLeadScore(callSession: CallSession): number {
    let score = 50; // Base score

    const sentiment = callSession.sentiment;
    if (sentiment) {
      if (sentiment.overall === 'positive') score += 20;
      if (sentiment.overall === 'negative') score -= 10;
    }

    const duration = callSession.duration;
    if (duration > 300) score += 15; // Long call = more interest
    if (duration < 60) score -= 10; // Short call = less interest

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Update CRM record with call information
   */
  private async updateCRMRecord(
    callSession: CallSession,
    outcome: string,
    notes: string,
    leadScore: number
  ): Promise<void> {
    this.log('Updating CRM record', {
      leadId: callSession.callId,
      outcome,
      leadScore,
    });

    // TODO: Implement actual API call
    // await salesAPI.updateLead(leadId, { callOutcome: outcome, callNotes: notes, leadScore });
  }

  /**
   * Log call in sales history
   */
  private async logSalesCall(callSession: CallSession): Promise<void> {
    this.log('Logging sales call', {
      callId: callSession.callId,
      duration: callSession.duration,
    });

    // TODO: Implement actual API call
    // await salesAPI.logCall(callSession);
  }
}
