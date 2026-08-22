import React, { useState, useEffect } from 'react';
import { Phone, User, Target, AlertCircle } from 'lucide-react';
import { EngineType, CallIntent } from '../../types/voice';
import { validatePhoneNumber, formatPhoneNumber } from '../../utils/phoneValidation';

interface CallInitiatorProps {
  engineType: EngineType;
  customerName: string;
  customerPhone: string;
  contextData?: any;
  onInitiateCall: (phoneNumber: string, purpose: string, intent: CallIntent) => void;
  disabled?: boolean;
}

const CallInitiator: React.FC<CallInitiatorProps> = ({
  engineType,
  customerName,
  customerPhone,
  contextData,
  onInitiateCall,
  disabled = false,
}) => {
  const [phoneNumber, setPhoneNumber] = useState(customerPhone || '');
  const [callPurpose, setCallPurpose] = useState('');
  const [isValidPhone, setIsValidPhone] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [isInitiating, setIsInitiating] = useState(false);

  // Validate phone number on change
  useEffect(() => {
    if (phoneNumber) {
      const validation = validatePhoneNumber(phoneNumber);
      setIsValidPhone(validation.isValid);
      setPhoneError(validation.isValid ? '' : validation.error || 'Invalid phone number');
    } else {
      setIsValidPhone(false);
      setPhoneError('');
    }
  }, [phoneNumber]);

  // Get call purposes based on engine type
  const getCallPurposes = (): Array<{ label: string; intent: CallIntent }> => {
    switch (engineType) {
      case 'service':
        return [
          { label: 'Appointment Booking', intent: 'appointment_booking' },
          { label: 'Service Status Inquiry', intent: 'status_inquiry' },
          { label: 'Parts Availability', intent: 'parts_availability' },
          { label: 'Service Reminder', intent: 'general_inquiry' },
          { label: 'Feedback Collection', intent: 'general_inquiry' },
        ];
      case 'sales':
        return [
          { label: 'Lead Qualification', intent: 'lead_qualification' },
          { label: 'Test Drive Booking', intent: 'test_drive_booking' },
          { label: 'Inventory Inquiry', intent: 'inventory_inquiry' },
          { label: 'Follow-up Call', intent: 'general_inquiry' },
          { label: 'Offer Presentation', intent: 'general_inquiry' },
        ];
      case 'finance':
        return [
          { label: 'Loan Inquiry', intent: 'loan_inquiry' },
          { label: 'EMI Calculation', intent: 'emi_calculation' },
          { label: 'Document Collection', intent: 'document_collection' },
          { label: 'Application Status', intent: 'status_inquiry' },
          { label: 'Approval Notification', intent: 'general_inquiry' },
        ];
      case 'insurance':
        return [
          { label: 'Claim Filing', intent: 'claim_filing' },
          { label: 'Renewal Inquiry', intent: 'renewal_inquiry' },
          { label: 'Coverage Check', intent: 'coverage_check' },
          { label: 'Policy Update', intent: 'general_inquiry' },
          { label: 'Premium Payment', intent: 'general_inquiry' },
        ];
      case 'workforce':
        return [
          { label: 'Schedule Coordination', intent: 'schedule_coordination' },
          { label: 'Performance Review', intent: 'performance_review' },
          { label: 'Training Inquiry', intent: 'training_inquiry' },
          { label: 'Leave Request', intent: 'general_inquiry' },
          { label: 'Shift Change', intent: 'general_inquiry' },
        ];
      case 'fleet':
        return [
          { label: 'Route Optimization', intent: 'route_optimization' },
          { label: 'Emergency Assistance', intent: 'emergency_assistance' },
          { label: 'Status Check', intent: 'status_check' },
          { label: 'Maintenance Alert', intent: 'general_inquiry' },
          { label: 'Delivery Coordination', intent: 'general_inquiry' },
        ];
      default:
        return [{ label: 'General Inquiry', intent: 'general_inquiry' }];
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const handleInitiate = async () => {
    if (!isValidPhone || !callPurpose) return;

    setIsInitiating(true);
    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      const purposes = getCallPurposes();
      const selectedPurpose = purposes.find(p => p.label === callPurpose);
      const intent = selectedPurpose?.intent || 'general_inquiry';
      await onInitiateCall(formattedPhone, callPurpose, intent);
    } finally {
      setIsInitiating(false);
    }
  };

  const getEngineColor = () => {
    switch (engineType) {
      case 'service':
        return 'orange';
      case 'sales':
        return 'blue';
      case 'finance':
        return 'emerald';
      case 'insurance':
        return 'rose';
      case 'workforce':
        return 'purple';
      case 'fleet':
        return 'green';
      default:
        return 'blue';
    }
  };

  const color = getEngineColor();
  const purposes = getCallPurposes();
  const canInitiate = isValidPhone && callPurpose && !disabled && !isInitiating;

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 p-6 space-y-6">
      {/* Customer Preview */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
        <div className={`w-12 h-12 rounded-full bg-${color}-100 flex items-center justify-center`}>
          <User size={24} className={`text-${color}-600`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900">{customerName}</h3>
          <p className="text-sm text-slate-600">Customer Information</p>
        </div>
      </div>

      {/* Phone Number Input */}
      <div className="space-y-2">
        <label htmlFor="phone-input" className="block text-sm font-medium text-slate-700">
          Phone Number <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="phone-input"
            type="tel"
            value={phoneNumber}
            onChange={handlePhoneChange}
            placeholder="+91 98765 43210"
            className={`w-full px-4 py-3 pl-10 border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              phoneError && phoneNumber
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                : isValidPhone
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200'
                : 'border-slate-300 focus:border-${color}-500 focus:ring-${color}-200'
            }`}
            disabled={disabled}
            aria-label="Phone number input"
            aria-invalid={!!phoneError && !!phoneNumber}
            aria-describedby={phoneError && phoneNumber ? 'phone-error' : undefined}
          />
          <Phone
            size={18}
            className={`absolute left-3 top-1/2 -translate-y-1/2 ${
              phoneError && phoneNumber
                ? 'text-red-500'
                : isValidPhone
                ? 'text-green-500'
                : 'text-slate-400'
            }`}
          />
        </div>
        {phoneError && phoneNumber && (
          <div id="phone-error" className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle size={16} />
            <span>{phoneError}</span>
          </div>
        )}
        {isValidPhone && (
          <p className="text-sm text-green-600 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Valid phone number
          </p>
        )}
      </div>

      {/* Call Purpose Selector */}
      <div className="space-y-2">
        <label htmlFor="purpose-select" className="block text-sm font-medium text-slate-700">
          Call Purpose <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="purpose-select"
            value={callPurpose}
            onChange={(e) => setCallPurpose(e.target.value)}
            className={`w-full px-4 py-3 pl-10 border-2 border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:border-${color}-500 focus:ring-${color}-200 transition-colors appearance-none bg-white cursor-pointer`}
            disabled={disabled}
            aria-label="Call purpose selector"
          >
            <option value="">Select a purpose...</option>
            {purposes.map((purpose) => (
              <option key={purpose.label} value={purpose.label}>
                {purpose.label}
              </option>
            ))}
          </select>
          <Target
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* Context Data Preview */}
      {contextData && (
        <div className="bg-slate-50 rounded-lg p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Context Information
          </p>
          <div className="text-sm text-slate-700 space-y-1">
            {contextData.vehicleModel && (
              <p>
                <span className="font-medium">Vehicle:</span> {contextData.vehicleModel}
              </p>
            )}
            {contextData.serviceType && (
              <p>
                <span className="font-medium">Service:</span> {contextData.serviceType}
              </p>
            )}
            {contextData.leadSource && (
              <p>
                <span className="font-medium">Source:</span> {contextData.leadSource}
              </p>
            )}
            {contextData.loanAmount && (
              <p>
                <span className="font-medium">Loan Amount:</span> ₹{contextData.loanAmount.toLocaleString()}
              </p>
            )}
            {contextData.policyNumber && (
              <p>
                <span className="font-medium">Policy:</span> {contextData.policyNumber}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Initiate Call Button */}
      <button
        onClick={handleInitiate}
        disabled={!canInitiate}
        className={`w-full py-4 rounded-xl font-semibold text-lg shadow-lg transition-all duration-200 flex items-center justify-center gap-3 ${
          canInitiate
            ? `bg-gradient-to-r from-${color}-600 to-${color}-700 hover:from-${color}-700 hover:to-${color}-800 text-white hover:shadow-xl transform hover:scale-[1.02]`
            : 'bg-slate-300 text-slate-500 cursor-not-allowed'
        }`}
        aria-label="Initiate call"
        aria-disabled={!canInitiate}
      >
        {isInitiating ? (
          <>
            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
            Initiating Call...
          </>
        ) : (
          <>
            <Phone size={24} />
            Initiate Call
          </>
        )}
      </button>

      {!canInitiate && !disabled && (
        <p className="text-sm text-slate-500 text-center">
          Please enter a valid phone number and select a call purpose
        </p>
      )}
    </div>
  );
};

export default CallInitiator;
