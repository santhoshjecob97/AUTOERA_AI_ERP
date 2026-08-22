import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Workforce Engine Voice Adapter
 * Transforms employee data into voice call context
 */
export class WorkforceVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('workforce');
  }

  /**
   * Transform employee data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming workforce context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'workforce',
      customer,
      context: {
        employeeId: data.employeeId || data.id,
        employeeName: data.employeeName || data.name,
        department: data.department,
        position: data.position || data.role,
        manager: data.manager,
        shift: data.shift,
        schedule: data.schedule,
        performanceRating: data.performanceRating,
        lastReviewDate: data.lastReviewDate,
        trainingRequired: data.trainingRequired || [],
        status: data.status,
        hireDate: data.hireDate,
      },
      intents: this.getIntents(),
      metadata: {
        source: 'workforce_engine',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate workforce-focused greeting with employee details
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    const departmentInfo = ctx.department
      ? ` from ${ctx.department}`
      : '';

    return this.formatGreeting(
      customer.name,
      `I'm calling from HR${departmentInfo}. I'd like to discuss some important matters with you.`
    );
  }

  /**
   * Get workforce-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'schedule_coordination',
      'performance_review',
      'training_inquiry',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update HR records
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for workforce', callSession);

    try {
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);

      await this.updateHRRecord(callSession, outcome, notes);
      await this.logWorkforceCall(callSession);

      this.log('Workforce call end handled successfully');
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

    const hasSchedule = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('schedule') ||
        t.text.toLowerCase().includes('shift')
    );

    if (hasSchedule) {
      return 'schedule_discussed';
    }

    const hasPerformance = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('performance') ||
        t.text.toLowerCase().includes('review')
    );

    if (hasPerformance) {
      return 'performance_discussed';
    }

    const hasTraining = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('training') ||
        t.text.toLowerCase().includes('course')
    );

    if (hasTraining) {
      return 'training_discussed';
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
   * Update HR record with call information
   */
  private async updateHRRecord(
    callSession: CallSession,
    outcome: string,
    notes: string
  ): Promise<void> {
    this.log('Updating HR record', {
      employeeId: callSession.callId,
      outcome,
    });

    // TODO: Implement actual API call
    // await workforceAPI.updateEmployee(employeeId, { callOutcome: outcome, callNotes: notes });
  }

  /**
   * Log call in workforce history
   */
  private async logWorkforceCall(callSession: CallSession): Promise<void> {
    this.log('Logging workforce call', {
      callId: callSession.callId,
      duration: callSession.duration,
    });

    // TODO: Implement actual API call
    // await workforceAPI.logCall(callSession);
  }
}
