import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Service Engine Voice Adapter
 * Transforms service job data into voice call context
 */
export class ServiceVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('service');
  }

  /**
   * Transform service job data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming service context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'service',
      customer,
      context: {
        jobId: data.jobId || data.id,
        vehicleModel: data.vehicleModel || data.vehicle?.model,
        vehicleNumber: data.vehicleNumber || data.vehicle?.registrationNumber,
        serviceType: data.serviceType || data.type,
        appointmentDate: data.appointmentDate || data.scheduledDate,
        serviceAdvisor: data.serviceAdvisor || data.advisor,
        estimatedCost: data.estimatedCost || data.cost,
        status: data.status,
        bayNumber: data.bayNumber || data.bay,
        lastServiceDate: data.lastServiceDate,
        mileage: data.mileage || data.vehicle?.mileage,
      },
      intents: this.getIntents(),
      metadata: {
        source: 'service_engine',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate service-focused greeting with vehicle details
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    const vehicleInfo = ctx.vehicleModel
      ? ` regarding your ${ctx.vehicleModel}`
      : '';
    const serviceType = ctx.serviceType
      ? ` for ${ctx.serviceType}`
      : '';

    return this.formatGreeting(
      customer.name,
      `I'm calling from the service department${vehicleInfo}${serviceType}. How can I assist you today?`
    );
  }

  /**
   * Get service-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'appointment_booking',
      'status_inquiry',
      'parts_availability',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update service records
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for service', callSession);

    try {
      // Extract call outcome and notes
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);

      // Update service job record
      await this.updateServiceRecord(callSession, outcome, notes);

      // Log call in service history
      await this.logServiceCall(callSession);

      this.log('Service call end handled successfully');
    } catch (error) {
      this.handleError(error, 'handleCallEnd');
    }
  }

  /**
   * Validate service-specific context data
   */
  validateContext(data: any): { isValid: boolean; errors?: string[] } {
    const baseValidation = super.validateContext(data);
    if (!baseValidation.isValid) {
      return baseValidation;
    }

    const errors: string[] = [];

    // Service-specific validation
    if (!data.vehicleModel && !data.vehicle?.model) {
      errors.push('Vehicle model is required for service calls');
    }

    if (!data.serviceType && !data.type) {
      errors.push('Service type is required');
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
    // Analyze transcription and sentiment to determine outcome
    const transcription = callSession.transcription || [];
    const sentiment = callSession.sentiment;

    if (transcription.length === 0) {
      return 'no_answer';
    }

    // Check for appointment booking keywords
    const hasAppointment = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('appointment') ||
        t.text.toLowerCase().includes('schedule') ||
        t.text.toLowerCase().includes('book')
    );

    if (hasAppointment) {
      return 'appointment_booked';
    }

    // Check for status inquiry
    const hasStatusInquiry = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('status') ||
        t.text.toLowerCase().includes('ready') ||
        t.text.toLowerCase().includes('complete')
    );

    if (hasStatusInquiry) {
      return 'status_provided';
    }

    // Check sentiment for satisfaction
    if (sentiment && sentiment.overall === 'positive') {
      return 'satisfied';
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

    // Combine transcription into notes
    const notes = transcription
      .map((t) => `[${t.speaker}]: ${t.text}`)
      .join('\n');

    return notes.substring(0, 500); // Limit to 500 characters
  }

  /**
   * Update service record with call information
   */
  private async updateServiceRecord(
    callSession: CallSession,
    outcome: string,
    notes: string
  ): Promise<void> {
    // This would integrate with your service API
    this.log('Updating service record', {
      jobId: callSession.callId,
      outcome,
      notes: notes.substring(0, 100),
    });

    // TODO: Implement actual API call
    // await serviceAPI.updateJob(jobId, { callOutcome: outcome, callNotes: notes });
  }

  /**
   * Log call in service history
   */
  private async logServiceCall(callSession: CallSession): Promise<void> {
    this.log('Logging service call', {
      callId: callSession.callId,
      duration: callSession.duration,
      status: callSession.status,
    });

    // TODO: Implement actual API call
    // await serviceAPI.logCall(callSession);
  }
}
