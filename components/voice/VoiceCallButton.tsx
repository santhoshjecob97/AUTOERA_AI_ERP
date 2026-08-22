import React from 'react';
import { Phone } from 'lucide-react';
import { EngineType } from '../../types/voice';

interface VoiceCallButtonProps {
  engineType: EngineType;
  contextData: any;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  onCallStart?: (callId: string) => void;
  onClick?: () => void;
}

const VoiceCallButton: React.FC<VoiceCallButtonProps> = ({
  engineType,
  contextData,
  customerId,
  customerName,
  customerPhone,
  disabled = false,
  variant = 'primary',
  size = 'md',
  onCallStart,
  onClick,
}) => {
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const getButtonStyles = () => {
    const baseStyles = 'flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200';
    
    if (disabled) {
      return `${baseStyles} bg-slate-200 text-slate-400 cursor-not-allowed`;
    }

    switch (variant) {
      case 'primary':
        return `${baseStyles} bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 shadow-md hover:shadow-lg`;
      case 'secondary':
        return `${baseStyles} bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-4 py-2`;
      case 'icon':
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md hover:shadow-lg`;
      default:
        return `${baseStyles} bg-blue-600 hover:bg-blue-700 text-white px-4 py-2`;
    }
  };

  const getEngineColor = () => {
    switch (engineType) {
      case 'service':
        return 'from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700';
      case 'sales':
        return 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
      case 'finance':
        return 'from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700';
      case 'insurance':
        return 'from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700';
      case 'workforce':
        return 'from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700';
      case 'fleet':
        return 'from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700';
      default:
        return 'from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700';
    }
  };

  const buttonStyles = variant === 'primary' 
    ? `flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 bg-gradient-to-r ${getEngineColor()} text-white px-4 py-2 shadow-md hover:shadow-lg ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
    : getButtonStyles();

  const getIconSize = () => {
    if (variant === 'icon') {
      switch (size) {
        case 'sm': return 16;
        case 'lg': return 24;
        default: return 20;
      }
    }
    return 18;
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonStyles}
      aria-label={`Initiate voice call for ${engineType} engine`}
      title={disabled ? 'Select a customer to make a call' : `Call ${customerName || 'customer'}`}
    >
      <Phone size={getIconSize()} />
      {variant !== 'icon' && (
        <span className="text-sm font-semibold">
          {customerName ? `Call ${customerName}` : 'Voice Call'}
        </span>
      )}
    </button>
  );
};

export default VoiceCallButton;
