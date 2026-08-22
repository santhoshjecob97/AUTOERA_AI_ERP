import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Finance Engine Voice Adapter
 * Transforms loan application data into voice call context
 */
export class FinanceVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('finance');
  }

  /**
   * Transform loan application data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming finance context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'finance',
      customer,
      context: {
        applicationId: data.applicationId || data.id,
        loanAmount: data.loanAmount || data.amount,
        loanTerm: data.loanTerm || data.term,
        interestRate: data.interestRate || data.rate,
        emiAmount: data.emiAmount || data.emi,
        applicantIncome: data.applicantIncome || data.income,
        creditScore: data.creditScore,
        employmentType: data.employmentType,
        vehicleModel: data.vehicleModel || data.vehicle,
        downPayment: data.downPayment,
        status: data.status,
        approvalStatus: data.approvalStatus,
        documentsRequired: data.documentsRequired || [],
      },
      intents: this.getIntents(),
      metadata: {
        source: 'finance_engine',
        timestamp: new Date().toISOString(),
        complianceRequired: true,
      },
    };
  }

  /**
   * Generate finance-focused greeting with application details
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    const loanInfo = ctx.loanAmount
      ? ` regarding your loan application for ₹${ctx.loanAmount.toLocaleString()}`
      : '';

    return this.formatGreeting(
      customer.name,
      `I'm calling from the finance department${loanInfo}. I'd like to discuss your application and answer any questions you may have.`
    );
  }

  /**
   * Get finance-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'loan_inquiry',
      'emi_calculation',
      'document_collection',
      'status_inquiry',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update loan records and log compliance
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for finance', callSession);

    try {
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);

      await this.updateLoanRecord(callSession, outcome, notes);
      await this.logComplianceCall(callSession);
      await this.logFinanceCall(callSession);

      this.log('Finance call end handled successfully');
    } catch (error) {
      this.handleError(error, 'handleCallEnd');
    }
  }

  /**
   * Validate finance-specific context data
   */
  validateContext(data: any): { isValid: boolean; errors?: string[] } {
    const baseValidation = super.validateContext(data);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors: string[] = [];

    if (!data.loanAmount && !data.amount) {
      errors.push('Loan amount is required for finance calls');
    }

    if (!data.applicationId && !data.id) {
      errors.push('Application ID is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Extract call outcome from call session
   */
  private extractCallOutcome(callSession: CallSession): string {
    const transcription = callSession.transcription || [];

    if (transcription.length === 0) {
      return 'no_answer';
    }

    const hasDocuments = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('document') ||
        t.text.toLowerCase().includes('submit')
    );

    if (hasDocuments) {
      return 'documents_discussed';
    }

    const hasEMI = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('emi') ||
        t.text.toLowerCase().includes('payment')
    );

    if (hasEMI) {
      return 'emi_discussed';
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
   * Update loan record with call information
   */
  private async updateLoanRecord(
    callSession: CallSession,
    outcome: string,
    notes: string
  ): Promise<void> {
    this.log('Updating loan record', {
      applicationId: callSession.callId,
      outcome,
    });

    // TODO: Implement actual API call
    // await financeAPI.updateApplication(applicationId, { callOutcome: outcome, callNotes: notes });
  }

  /**
   * Log call for compliance purposes
   */
  private async logComplianceCall(callSession: CallSession): Promise<void> {
    this.log('Logging compliance call', {
      callId: callSession.callId,
      duration: callSession.duration,
      recordingUrl: callSession.recordingUrl,
    });

    // TODO: Implement actual API call for compliance logging
    // await complianceAPI.logCall({
    //   callId: callSession.callId,
    //   type: 'finance',
    //   duration: callSession.duration,
    //   recordingUrl: callSession.recordingUrl,
    //   timestamp: callSession.startTime,
    // });
  }

  /**
   * Log call in finance history
   */
  private async logFinanceCall(callSession: CallSession): Promise<void> {
    this.log('Logging finance call', {
      callId: callSession.callId,
      duration: callSession.duration,
    });

    // TODO: Implement actual API call
    // await financeAPI.logCall(callSession);
  }
}
