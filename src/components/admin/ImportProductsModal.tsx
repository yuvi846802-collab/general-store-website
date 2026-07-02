import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UploadCloud, FileType, CheckCircle2, AlertTriangle, Loader2, Play } from 'lucide-react';
import { importService, ImportValidationResult } from '@/services/importService';
import { productService } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface ImportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ImportProductsModal({ isOpen, onClose, onSuccess }: ImportProductsModalProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [validation, setValidation] = useState<ImportValidationResult | null>(null);
  
  const [isImporting, setIsImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [importSummary, setImportSummary] = useState<any>(null);

  const resetState = () => {
    setFile(null);
    setValidation(null);
    setProgress(0);
    setImportSummary(null);
    setIsImporting(false);
  };

  const handleClose = () => {
    if (isImporting) return;
    resetState();
    onClose();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      await processFile(selected);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) {
      await processFile(dropped);
    }
  };

  const processFile = async (file: File) => {
    setFile(file);
    setIsParsing(true);
    setValidation(null);
    
    try {
      let data: any[] = [];
      if (file.name.endsWith('.csv')) {
        data = await importService.parseCSV(file);
      } else if (file.name.match(/\.xlsx?$/)) {
        data = await importService.parseExcel(file);
      } else {
        throw new Error("Invalid file type. Please upload a CSV or Excel file.");
      }

      if (data.length === 0) throw new Error("The file is empty.");

      const result = await importService.validateData(data);
      setValidation(result);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to parse file",
        description: error.message || "An error occurred while reading the file.",
      });
      setFile(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (!validation || validation.validRows.length === 0) return;

    setIsImporting(true);
    setProgress(0);

    try {
      const summary = await productService.bulkImport(validation.validRows, (p) => setProgress(p));
      setImportSummary(summary);
      toast({
        title: "Import Complete",
        description: `Successfully imported ${summary.imported} products.`,
      });
      onSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Import Failed",
        description: error.message || "An unexpected error occurred during import.",
      });
      setIsImporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="import-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div>
                <h2 className="text-xl font-bold text-foreground">Import Products</h2>
                <p className="text-sm text-muted-foreground mt-1">Upload a CSV or Excel file to bulk import products.</p>
              </div>
              {!isImporting && (
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Content Body */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              
              {!file && !importSummary && (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-4">
                    <UploadCloud size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Click or drag file to this area to upload</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mb-4">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.</p>
                  <p className="text-xs font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">Accepted: .csv, .xlsx</p>
                  <input type="file" accept=".csv, .xlsx, .xls" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                </div>
              )}

              {isParsing && (
                <div className="py-12 flex flex-col items-center justify-center">
                  <Loader2 size={40} className="text-primary animate-spin mb-4" />
                  <p className="text-foreground font-medium">Analyzing file...</p>
                </div>
              )}

              {validation && !isImporting && !importSummary && (
                <div className="space-y-6">
                  {/* File Info */}
                  <div className="flex items-center gap-4 p-4 border border-border rounded-xl bg-background">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0">
                      <FileType size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">{(file!.size / 1024).toFixed(2)} KB</p>
                    </div>
                    <button onClick={() => setFile(null)} className="text-xs text-destructive hover:underline font-medium">Remove</button>
                  </div>

                  {/* Validation Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border border-border rounded-xl bg-green-500/5">
                      <div className="flex items-center gap-2 text-green-600 mb-1">
                        <CheckCircle2 size={16} />
                        <span className="font-semibold text-sm">Valid Rows</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{validation.validRows.length}</p>
                    </div>
                    <div className={`p-4 border border-border rounded-xl ${validation.errors.length > 0 ? 'bg-red-500/5' : 'bg-background'}`}>
                      <div className={`flex items-center gap-2 mb-1 ${validation.errors.length > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>
                        <AlertTriangle size={16} />
                        <span className="font-semibold text-sm">Invalid Rows</span>
                      </div>
                      <p className="text-2xl font-bold text-foreground">{validation.errors.length}</p>
                    </div>
                  </div>

                  {/* Errors List */}
                  {validation.errors.length > 0 && (
                    <div className="border border-border rounded-xl overflow-hidden">
                      <div className="bg-muted px-4 py-2 border-b border-border">
                        <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Validation Errors</h4>
                      </div>
                      <div className="max-h-40 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {validation.errors.map((err, i) => (
                          <div key={i} className="text-xs px-3 py-2 bg-destructive/5 text-destructive rounded-lg flex items-start gap-2">
                            <span className="font-bold shrink-0">Row {err.row}:</span>
                            <span>{err.error}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Progress UI */}
              {isImporting && !importSummary && (
                <div className="py-8 flex flex-col items-center justify-center">
                  <h3 className="text-lg font-bold text-foreground mb-6">Importing Products...</h3>
                  
                  {/* Custom Progress Bar */}
                  <div className="w-full max-w-md bg-muted rounded-full h-3 mb-2 overflow-hidden border border-border">
                    <motion.div 
                      className="bg-primary h-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{progress}% Complete</p>
                </div>
              )}

              {/* Summary View */}
              {importSummary && (
                <div className="py-6 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-green-500/20 text-green-600 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Import Successful</h3>
                  
                  <div className="w-full max-w-sm border border-border rounded-xl p-4 mt-4 space-y-3 bg-background text-left">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Newly Imported</span>
                      <span className="font-bold text-foreground">{importSummary.imported}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Updated (Duplicates)</span>
                      <span className="font-bold text-foreground">{importSummary.updated}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Skipped</span>
                      <span className="font-bold text-foreground">{importSummary.skipped}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pt-3 border-t border-border">
                      <span className="text-muted-foreground">Failed</span>
                      <span className="font-bold text-destructive">{importSummary.failed}</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-end gap-3">
              {!isImporting && !importSummary && (
                <button onClick={handleClose} className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors">
                  Cancel
                </button>
              )}
              
              {importSummary ? (
                <button onClick={handleClose} className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm">
                  Done
                </button>
              ) : (
                <button 
                  onClick={handleImport}
                  disabled={!validation || validation.validRows.length === 0 || isImporting}
                  className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isImporting ? (
                    <><Loader2 size={16} className="animate-spin" /> Processing...</>
                  ) : (
                    <><Play size={16} /> Start Import</>
                  )}
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
