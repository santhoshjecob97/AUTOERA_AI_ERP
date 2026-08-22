import React, { useCallback, useRef, useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle2, Download } from 'lucide-react';
import Papa from 'papaparse';

export interface CsvColumn {
  key: string;
  label: string;
  required?: boolean;
}

interface RowError {
  rowNumber: number;
  message: string;
}

interface CsvImportModalProps {
  isOpen: boolean;
  title: string;
  description?: string;
  maxFileSizeMB?: number;
  columns: CsvColumn[];
  sampleRows?: Record<string, any>[];
  mapRow: (raw: Record<string, string>, index: number) => { value?: any; error?: string };
  onImport: (rows: any[]) => void;
  onClose: () => void;
}

const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  title,
  description,
  maxFileSizeMB = 10,
  columns,
  sampleRows,
  mapRow,
  onImport,
  onClose,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [headerErrors, setHeaderErrors] = useState<string[]>([]);
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [rows, setRows] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setFile(null);
    setIsDragging(false);
    setIsParsing(false);
    setParseError(null);
    setHeaderErrors([]);
    setRowErrors([]);
    setRows([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateFile = (targetFile: File): string | null => {
    if (!targetFile.name.toLowerCase().endsWith('.csv')) {
      return 'Only .csv files are supported.';
    }
    const sizeMB = targetFile.size / (1024 * 1024);
    if (sizeMB > maxFileSizeMB) {
      return `File size exceeds ${maxFileSizeMB}MB limit.`;
    }
    return null;
  };

  const handleParse = (targetFile: File) => {
    const validationError = validateFile(targetFile);
    if (validationError) {
      setParseError(validationError);
      setHeaderErrors([]);
      setRowErrors([]);
      setRows([]);
      return;
    }

    setIsParsing(true);
    setParseError(null);
    setHeaderErrors([]);
    setRowErrors([]);
    setRows([]);

    Papa.parse(targetFile, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const fields = result.meta.fields || [];
        const requiredCols = columns.filter((c) => c.required).map((c) => c.key);
        const missing = requiredCols.filter((key) => !fields.includes(key));

        const newHeaderErrors: string[] = [];
        if (fields.length === 0) {
          newHeaderErrors.push('CSV file has no header row.');
        }
        if (missing.length > 0) {
          newHeaderErrors.push(`Missing required columns: ${missing.join(', ')}`);
        }

        const validRows: any[] = [];
        const newRowErrors: RowError[] = [];

        (result.data as any[]).forEach((raw, index) => {
          const values = Object.values(raw || {});
          const isCompletelyEmpty = values.length === 0 || values.every((v) => {
            if (v === null || v === undefined) return true;
            return String(v).trim() === '';
          });
          if (isCompletelyEmpty) return;

          const mapped = mapRow(raw as Record<string, string>, index);
          if (mapped.error) {
            newRowErrors.push({ rowNumber: index + 2, message: mapped.error });
          } else if (mapped.value) {
            validRows.push(mapped.value);
          }
        });

        setHeaderErrors(newHeaderErrors);
        setRowErrors(newRowErrors);
        setRows(validRows);
        setIsParsing(false);
      },
      error: (error) => {
        setIsParsing(false);
        setParseError(`Failed to read CSV: ${error.message}`);
      },
    });
  };

  const handleFileSelect = (targetFile: File | null) => {
    if (!targetFile) return;
    setFile(targetFile);
    handleParse(targetFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files?.[0];
    handleFileSelect(targetFile || null);
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files || []) as File[];
    if (droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0]);
    }
  }, []);

  const handleDownloadTemplate = () => {
    const headerKeys = columns.map((c) => c.key);

    const emptyTemplate: Record<string, string> = headerKeys.reduce((acc, key) => {
      acc[key] = '';
      return acc;
    }, {} as Record<string, string>);
    
    const templates = sampleRows && sampleRows.length > 0 ? sampleRows : [emptyTemplate];

    const csv = Papa.unparse({
      fields: headerKeys,
      data: templates.map((row) => headerKeys.map((key) => (row[key] ?? '').toString())),
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}_template.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    if (!file || rows.length === 0 || headerErrors.length > 0 || rowErrors.length > 0) return;
    onImport(rows);
    resetState();
    onClose();
  };

  const hasErrors = !!parseError || headerErrors.length > 0 || rowErrors.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText size={18} className="text-indigo-600" />
              {title}
            </h2>
            {description && (
              <p className="text-xs text-slate-500 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Download size={14} />
              Template
            </button>
            <button
              type="button"
              onClick={() => {
                resetState();
                onClose();
              }}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          {!file && (
            <div
              onDragEnter={handleDragEnter}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/60'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload
                size={40}
                className={
                  isDragging
                    ? 'mx-auto mb-4 text-indigo-600'
                    : 'mx-auto mb-4 text-slate-400'
                }
              />
              <p className="text-sm font-semibold text-slate-900 mb-1">Drop CSV file here</p>
              <p className="text-xs text-slate-500 mb-3">
                or click to browse (max {maxFileSizeMB}MB)
              </p>
              <p className="text-[11px] text-slate-400">
                Required columns: {columns.filter((c) => c.required).map((c) => c.key).join(', ')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInputChange}
              />
            </div>
          )}

          {file && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
                <div className="flex items-center gap-3">
                  <FileText size={22} className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{file.name}</p>
                    <p className="text-xs text-slate-500">
                      {(file.size / 1024).toFixed(1)} KB • {rows.length} valid rows
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={resetState}
                  className="text-xs text-slate-500 hover:text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg"
                >
                  Clear
                </button>
              </div>

              {isParsing && (
                <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                  <Upload size={14} className="animate-pulse text-indigo-600" />
                  Parsing CSV...
                </div>
              )}

              {parseError && (
                <div className="flex items-start gap-2 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertCircle size={14} className="text-red-600 mt-0.5" />
                  <span className="text-red-800">{parseError}</span>
                </div>
              )}

              {headerErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-800">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle size={14} />
                    <span className="font-semibold">Header issues</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5">
                    {headerErrors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rowErrors.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <div className="flex items-center gap-1 mb-1">
                    <AlertCircle size={14} />
                    <span className="font-semibold">Row validation issues</span>
                  </div>
                  <p className="mb-1">First few problems:</p>
                  <ul className="list-disc list-inside space-y-0.5 max-h-32 overflow-y-auto">
                    {rowErrors.slice(0, 10).map((err, idx) => (
                      <li key={idx}>
                        Row {err.rowNumber}: {err.message}
                      </li>
                    ))}
                    {rowErrors.length > 10 && (
                      <li>...and {rowErrors.length - 10} more</li>
                    )}
                  </ul>
                </div>
              )}

              {!hasErrors && file && rows.length > 0 && (
                <div className="flex items-center gap-2 text-xs bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-green-800">
                  <CheckCircle2 size={14} />
                  <span>
                    Ready to import <strong>{rows.length}</strong> row{rows.length === 1 ? '' : 's'}.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              resetState();
              onClose();
            }}
            className="px-4 py-2 text-xs font-medium text-slate-700 rounded-lg border border-slate-200 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!file || rows.length === 0 || hasErrors || isParsing}
            onClick={handleImportClick}
            className="px-5 py-2 text-xs font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Upload size={14} />
            Import Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default CsvImportModal;
