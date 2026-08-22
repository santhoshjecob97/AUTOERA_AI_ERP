import { VoiceCallContext, CallIntent, CallSession } from '../types/voice';
import { VoiceContextAdapter } from './VoiceContextAdapter';

/**
 * Fleet Engine Voice Adapter
 * Transforms fleet vehicle data into voice call context
 */
export class FleetVoiceAdapter extends VoiceContextAdapter {
  constructor() {
    super('fleet');
  }

  /**
   * Transform fleet vehicle data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext {
    this.log('Transforming fleet context', data);

    const customer = this.extractCustomerInfo(data);

    return {
      engineType: 'fleet',
      customer,
      context: {
        vehicleId: data.vehicleId || data.id,
        vehicleNumber: data.vehicleNumber || data.registrationNumber,
        vehicleModel: data.vehicleModel || data.model,
        driverName: data.driverName || data.driver?.name,
        driverPhone: data.driverPhone || data.driver?.phone,
        currentLocation: data.currentLocation || data.location,
        destination: data.destination,
        route: data.route,
        status: data.status,
        fuelLevel: data.fuelLevel,
        mileage: data.mileage,
        lastMaintenanceDate: data.lastMaintenanceDate,
        nextMaintenanceDate: data.nextMaintenanceDate,
        emergencyType: data.emergencyType,
      },
      intents: this.getIntents(),
      metadata: {
        source: 'fleet_engine',
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Generate fleet-focused greeting with vehicle status
   */
  generateGreeting(context: VoiceCallContext): string {
    const { customer, context: ctx } = context;
    const vehicleInfo = ctx.vehicleNumber
      ? ` regarding vehicle ${ctx.vehicleNumber}`
      : '';

    return this.formatGreeting(
      customer.name,
      `I'm calling from fleet management${vehicleInfo}. How can I assist you today?`
    );
  }

  /**
   * Get fleet-specific intents
   */
  getIntents(): CallIntent[] {
    return [
      'route_optimization',
      'emergency_assistance',
      'status_check',
      'general_inquiry',
    ];
  }

  /**
   * Handle call end - update fleet records
   */
  async handleCallEnd(callSession: CallSession): Promise<void> {
    this.log('Handling call end for fleet', callSession);

    try {
      const outcome = this.extractCallOutcome(callSession);
      const notes = this.extractCallNotes(callSession);

      await this.updateFleetRecord(callSession, outcome, notes);
      await this.logFleetCall(callSession);

      this.log('Fleet call end handled successfully');
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

    const hasEmergency = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('emergency') ||
        t.text.toLowerCase().includes('urgent') ||
        t.text.toLowerCase().includes('help')
    );

    if (hasEmergency) {
      return 'emergency_handled';
    }

    const hasRoute = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('route') ||
        t.text.toLowerCase().includes('direction')
    );

    if (hasRoute) {
      return 'route_discussed';
    }

    const hasStatus = transcription.some(
      (t) =>
        t.text.toLowerCase().includes('status') ||
        t.text.toLowerCase().includes('location')
    );

    if (hasStatus) {
      return 'status_provided';
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
   * Update fleet record with call information
   */
  private async updateFleetRecord(
    callSession: CallSession,
    outcome: string,
    notes: string
  ): Promise<void> {
    this.log('Updating fleet record', {
      vehicleId: callSession.callId,
      outcome,
    });

    // TODO: Implement actual API call
    // await fleetAPI.updateVehicle(vehicleId, { callOutcome: outcome, callNotes: notes });
  }

  /**
   * Log call in fleet history
   */
  private async logFleetCall(callSession: CallSession): Promise<void> {
    this.log('Logging fleet call', {
      callId: callSession.callId,
      duration: callSession.duration,
    });

    // TODO: Implement actual API call
    // await fleetAPI.logCall(callSession);
  }
}
