import React, { useState } from 'react';
import { X, Upload, Scan, Check, AlertTriangle, FileText, Loader2 } from 'lucide-react';
import { OCRField } from '../types';

interface OCRModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OCRModal: React.FC<OCRModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'upload' | 'scanning' | 'review'>('upload');
  const [scannedData, setScannedData] = useState<OCRField[]>([]);

  if (!isOpen) return null;

  const handleScan = () => {
    setStep('scanning');
    // Simulate AI Processing
    setTimeout(() => {
      setScannedData([
        { label: 'Name', value: 'Rajesh Kumar', confidence: 98 },
        { label: 'License No', value: 'MH-14-2022-009281', confidence: 95 },
        { label: 'DOB', value: '12/05/1985', confidence: 99 },
        { label: 'Address', value: 'Flat 402, Oak Residency, Pune', confidence: 65 }, // Low confidence example
        { label: 'Vehicle Class', value: 'MCWG / LMV', confidence: 92 },
      ]);
      setStep('review');
    }, 2000);
  };

  const handleFieldChange = (index: number, newValue: string) => {
    const updated = [...scannedData];
    updated[index].value = newValue;
    updated[index].confidence = 100; // User corrected it
    setScannedData(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Scan className="text-indigo-600" size={20} />
            <h3 className="font-bold text-slate-900">Document OCR Engine</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {step === 'upload' && (
            <div className="text-center space-y-6">
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer" onClick={handleScan}>
                <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Upload className="text-indigo-600" size={32} />
                </div>
                <p className="text-sm font-medium text-slate-900">Click to upload Document</p>
                <p className="text-xs text-slate-500 mt-1">Supports Driver's License, Insurance, RC</p>
              </div>
              <p className="text-xs text-slate-400">Advanced AI Engine enabled for text extraction & verification.</p>
            </div>
          )}

          {step === 'scanning' && (
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <div className="text-center">
                <p className="font-medium text-slate-900">Scanning Document...</p>
                <p className="text-xs text-slate-500">Analyzing layout and extracting text entities</p>
              </div>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100 flex gap-3">
                 <div className="p-1.5 bg-white rounded-md h-fit">
                    <FileText size={16} className="text-indigo-600"/>
                 </div>
                 <div>
                    <p className="text-sm font-bold text-indigo-900">Review Extracted Data</p>
                    <p className="text-xs text-indigo-700">Please verify fields highlighted in yellow (low confidence).</p>
                 </div>
              </div>

              <div className="space-y-3">
                {scannedData.map((field, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">{field.label}</label>
                      <div className="flex items-center gap-1">
                        <span className={`text-[10px] font-bold ${field.confidence < 80 ? 'text-orange-500' : 'text-green-500'}`}>
                          {field.confidence}% Confidence
                        </span>
                        {field.confidence < 80 && <AlertTriangle size={12} className="text-orange-500" />}
                      </div>
                    </div>
                    <input 
                      type="text" 
                      value={field.value} 
                      onChange={(e) => handleFieldChange(idx, e.target.value)}
                      className={`w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all
                        ${field.confidence < 80 ? 'border-orange-300 bg-orange-50/50' : 'border-slate-200 bg-white'}
                      `}
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4 flex gap-3">
                <button onClick={() => setStep('upload')} className="flex-1 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg">Retake</button>
                <button onClick={onClose} className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2">
                  <Check size={16} /> Confirm & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OCRModal;