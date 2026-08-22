import { EngineType, VoiceCallContext, CallIntent, CallSession } from '../types/voice';

/**
 * Base interface for Voice Context Adapters
 * Each engine implements this to transform engine-specific data into VoiceCallContext
 */
export interface IVoiceContextAdapter {
  /**
   * Transform engine-specific data into VoiceCallContext
   */
  transformContext(data: any): VoiceCallContext;

  /**
   * Generate engine-specific greeting message
   */
  generateGreeting(context: VoiceCallContext): string;

  /**
   * Get engine-specific intents
   */
  getIntents(): CallIntent[];

  /**
   * Handle call end - update engine-specific records
   */
  handleCallEnd(callSession: CallSession): Promise<void>;

  /**
   * Validate context data
   */
  validateContext(data: any): { isValid: boolean; errors?: string[] };
}

/**
 * Abstract base class for Voice Context Adapters
 * Provides common functionality for all engine adapters
 */
export abstract class VoiceContextAdapter implements IVoiceContextAdapter {
  protected engineType: EngineType;

  constructor(engineType: EngineType) {
    this.engineType = engineType;
  }

  /**
   * Transform engine-specific data into VoiceCallContext
   * Must be implemented by each engine adapter
   */
  abstract transformContext(data: any): VoiceCallContext;

  /**
   * Generate engine-specific greeting message
   * Must be implemented by each engine adapter
   */
  abstract generateGreeting(context: VoiceCallContext): string;

  /**
   * Get engine-specific intents
   * Must be implemented by each engine adapter
   */
  abstract getIntents(): CallIntent[];

  /**
   * Handle call end - update engine-specific records
   * Must be implemented by each engine adapter
   */
  abstract handleCallEnd(callSession: CallSession): Promise<void>;

  /**
   * Validate context data
   * Can be overridden by specific adapters for custom validation
   */
  validateContext(data: any): { isValid: boolean; errors?: string[] } {
    const errors: string[] = [];

    // Common validation
    if (!data) {
      errors.push('Context data is required');
      return { isValid: false, errors };
    }

    // Check for customer information
    if (!data.customerName && !data.customer?.name) {
      errors.push('Customer name is required');
    }

    if (!data.customerPhone && !data.customer?.phone) {
      errors.push('Customer phone is required');
    }

    return {
      isValid: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined,
    };
  }

  /**
   * Extract customer information from various data formats
   */
  protected extractCustomerInfo(data: any): {
    id?: string;
    name: string;
    phone: string;
    email?: string;
  } {
    return {
      id: data.customerId || data.customer?.id || data.id,
      name: data.customerName || data.customer?.name || data.name || 'Unknown Customer',
      phone: data.customerPhone || data.customer?.phone || data.phone || '',
      email: data.customerEmail || data.customer?.email || data.email,
    };
  }

  /**
   * Format greeting with customer name
   */
  protected formatGreeting(customerName: string, context: string): string {
    return `Hello ${customerName}, ${context}`;
  }

  /**
   * Handle errors gracefully
   */
  protected handleError(error: any, context: string): void {
    console.error(`[${this.engineType}] Error in ${context}:`, error);
  }

  /**
   * Log adapter activity
   */
  protected log(message: string, data?: any): void {
    console.log(`[${this.engineType} Adapter] ${message}`, data || '');
  }
}

/**
 * Factory function to create appropriate adapter based on engine type
 */
export const createVoiceAdapter = async (engineType: EngineType): Promise<VoiceContextAdapter> => {
  switch (engineType) {
    case 'service': {
      const { ServiceVoiceAdapter } = await import('./ServiceVoiceAdapter');
      return new ServiceVoiceAdapter();
    }
    case 'sales': {
      const { SalesVoiceAdapter } = await import('./SalesVoiceAdapter');
      return new SalesVoiceAdapter();
    }
    case 'finance': {
      const { FinanceVoiceAdapter } = await import('./FinanceVoiceAdapter');
      return new FinanceVoiceAdapter();
    }
    case 'insurance': {
      const { InsuranceVoiceAdapter } = await import('./InsuranceVoiceAdapter');
      return new InsuranceVoiceAdapter();
    }
    case 'workforce': {
      const { WorkforceVoiceAdapter } = await import('./WorkforceVoiceAdapter');
      return new WorkforceVoiceAdapter();
    }
    case 'fleet': {
      const { FleetVoiceAdapter } = await import('./FleetVoiceAdapter');
      return new FleetVoiceAdapter();
    }
    default:
      throw new Error(`Adapter for engine type "${engineType}" not implemented`);
  }
};
