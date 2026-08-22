import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, Download } from 'lucide-react';
import Papa from 'papaparse';

export interface BulkUploadProps {
  modelId: string;
  modelName: string;
  acceptedColumns: string[];
  maxFileSize?: number; // in MB
  onUploadComplete: (results: any[]) => void;
  onError: (error: string) => void;
  onClose: () => void;
}

interface UploadState {
  file: File | null;
  isDragging: boolean;
  isValidating: boolean;
  isProcessing: boolean;
  progress: number;
  error: string | null;
  validationErrors: string[];
  columnMapping: Record<string, string>;
  parsedData: any[];
  results: any[] | null;
}

const BulkUpload: React.FC<BulkUploadProps> = ({
  modelId,
  modelName,
  acceptedColumns,
  maxFileSize = 50,
  onUploadComplete,
  onError,
  onClose,
}) => {
  const [state, setState] = useState<UploadState>({
    file: null,
    isDragging: false,
    isValidating: false,
    isProcessing: false,
    progress: 0,
    error: null,
    validationErrors: [],
    columnMapping: {},
    parsedData: [],
    results: null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: true }));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => ({ ...prev, isDragging: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0] as File);
    }
  }, []);

  // Validate file
  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.name.endsWith('.csv')) {
      return 'Only CSV files are accepted';
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      return `File size exceeds ${maxFileSize}MB limit`;
    }

    return null;
  };

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState((prev) => ({ ...prev, error: validationError }));
      onError(validationError);
      return;
    }

    setState((prev) => ({
      ...prev,
      file,
      error: null,
      isValidating: true,
      validationErrors: [],
    }));

    // Parse CSV
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const errors: string[] = [];
        const csvColumns = results.meta.fields || [];

        // Validate columns
        if (csvColumns.length === 0) {
          errors.push('CSV file has no columns');
        }

        // Check for required columns (basic validation)
        const missingColumns = acceptedColumns.filter(
          (col) => !csvColumns.includes(col)
        );

        if (missingColumns.length > 0) {
          errors.push(`Missing columns: ${missingColumns.join(', ')}`);
        }

        // Initialize column mapping
        const mapping: Record<string, string> = {};
        csvColumns.forEach((col) => {
          if (acceptedColumns.includes(col)) {
            mapping[col] = col;
          }
        });

        setState((prev) => ({
          ...prev,
          isValidating: false,
          validationErrors: errors,
          parsedData: results.data,
          columnMapping: mapping,
        }));
      },
      error: (error) => {
        setState((prev) => ({
          ...prev,
          isValidating: false,
          error: `Failed to parse CSV: ${error.message}`,
        }));
        onError(`Failed to parse CSV: ${error.message}`);
      },
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleRemoveFile = () => {
    setState({
      file: null,
      isDragging: false,
      isValidating: false,
      isProcessing: false,
      progress: 0,
      error: null,
      validationErrors: [],
      columnMapping: {},
      parsedData: [],
      results: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleStartProcessing = async () => {
    if (!state.file || state.validationErrors.length > 0) return;

    setState((prev) => ({ ...prev, isProcessing: true, progress: 0 }));

    // Simulate batch processing (replace with actual API call)
    try {
      // This would be replaced with actual API call
      // const response = await aiEngineApi.batchPredict(modelId, state.parsedData);
      
      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 300));
        setState((prev) => ({ ...prev, progress: i }));
      }

      // Mock results
      const mockResults = state.parsedData.map((row, idx) => ({
        ...row,
        prediction: Math.random() > 0.5 ? 'Positive' : 'Negative',
        confidence: (Math.random() * 30 + 70).toFixed(2),
        success: true,
      }));

      setState((prev) => ({
        ...prev,
        isProcessing: false,
        progress: 100,
        results: mockResults,
      }));

      onUploadComplete(mockResults);
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isProcessing: false,
        error: error.message || 'Processing failed',
      }));
      onError(error.message || 'Processing failed');
    }
  };

  const handleDownloadResults = () => {
    if (!state.results) return;

    const csv = Papa.unparse(state.results);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${modelName}_predictions_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Bulk Upload</h2>
            <p className="text-sm text-slate-600 mt-1">
              Upload CSV for batch predictions with {modelName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Upload Zone */}
          {!state.file && (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                state.isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50'
              }`}
            >
              <Upload
                size={48}
                className={`mx-auto mb-4 ${
                  state.isDragging ? 'text-indigo-600' : 'text-slate-400'
                }`}
              />
              <p className="text-lg font-semibold text-slate-900 mb-2">
                Drop your CSV file here
              </p>
              <p className="text-sm text-slate-600 mb-4">
                or click to browse (max {maxFileSize}MB)
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Select File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          )}

          {/* File Preview */}
          {state.file && !state.results && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-indigo-600" />
                  <div>
                    <p className="font-semibold text-slate-900">{state.file.name}</p>
                    <p className="text-sm text-slate-600">
                      {(state.file.size / 1024).toFixed(2)} KB • {state.parsedData.length} rows
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRemoveFile}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Validation Errors */}
              {state.validationErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-red-900 mb-2">Validation Errors:</p>
                      <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                        {state.validationErrors.map((error, idx) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Progress */}
              {state.isProcessing && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Processing...</span>
                    <span className="font-semibold text-slate-900">{state.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300 ease-out"
                      style={{ width: `${state.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 text-center">
                    Estimated time remaining: {Math.ceil((100 - state.progress) / 10)} seconds
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {state.results && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle size={20} className="text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Processing Complete!</p>
                    <p className="text-sm text-green-700">
                      Successfully processed {state.results.length} records
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleDownloadResults}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                <Download size={20} />
                Download Results CSV
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {state.file && !state.results && (
          <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
            <button
              onClick={handleRemoveFile}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartProcessing}
              disabled={
                state.validationErrors.length > 0 ||
                state.isProcessing ||
                state.isValidating
              }
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {state.isProcessing ? 'Processing...' : 'Start Processing'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkUpload;
