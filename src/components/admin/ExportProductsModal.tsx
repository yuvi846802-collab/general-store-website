import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DownloadCloud, FileText, Check, LayoutGrid } from 'lucide-react';
import { exportService, ExportFormat } from '@/services/exportService';
import { Product } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface ExportProductsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filteredProducts: Product[];
  allProducts: Product[];
}

const AVAILABLE_COLUMNS = ['Product Name', 'SKU', 'Category', 'Price', 'Inventory', 'Status'];

export default function ExportProductsModal({ isOpen, onClose, filteredProducts, allProducts }: ExportProductsModalProps) {
  const { toast } = useToast();
  
  const [exportScope, setExportScope] = useState<'all' | 'filtered'>('filtered');
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');
  const [selectedColumns, setSelectedColumns] = useState<string[]>(AVAILABLE_COLUMNS);
  const [isExporting, setIsExporting] = useState(false);

  const toggleColumn = (col: string) => {
    setSelectedColumns(prev => 
      prev.includes(col) ? prev.filter(c => c !== col) : [...prev, col]
    );
  };

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      toast({ variant: "destructive", title: "No Columns Selected", description: "Please select at least one column to export." });
      return;
    }

    setIsExporting(true);

    try {
      // Simulate large dataset preparation
      await new Promise(r => setTimeout(r, 800));

      const dataToExport = exportScope === 'all' ? allProducts : filteredProducts;
      
      const filename = `products_export_${new Date().toISOString().split('T')[0]}`;
      
      exportService.exportData(dataToExport, {
        format: exportFormat,
        filename,
        columns: selectedColumns
      });

      toast({
        title: "Export Successful",
        description: `Successfully downloaded ${filename}.${exportFormat}`,
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: error.message || "An error occurred while exporting.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-xl bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border bg-muted/20">
              <div>
                <h2 className="text-xl font-bold text-foreground">Export Options</h2>
                <p className="text-sm text-muted-foreground mt-1">Configure how you want to export your product data.</p>
              </div>
              <button onClick={onClose} disabled={isExporting} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors disabled:opacity-50">
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              
              {/* Scope Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">Data Scope</label>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => setExportScope('filtered')}
                    className={`p-3 border rounded-xl text-left transition-all ${exportScope === 'filtered' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="font-semibold text-sm">Filtered Results</div>
                    <div className="text-xs text-muted-foreground mt-1">Export {filteredProducts.length} items</div>
                  </button>
                  <button 
                    onClick={() => setExportScope('all')}
                    className={`p-3 border rounded-xl text-left transition-all ${exportScope === 'all' ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="font-semibold text-sm">Entire Database</div>
                    <div className="text-xs text-muted-foreground mt-1">Export all {allProducts.length} items</div>
                  </button>
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block">File Format</label>
                <div className="grid grid-cols-4 gap-3">
                  {['xlsx', 'csv', 'pdf', 'json'].map(format => (
                    <button 
                      key={format}
                      onClick={() => setExportFormat(format as ExportFormat)}
                      className={`py-2 px-3 border rounded-xl text-center transition-all uppercase text-xs font-bold tracking-wider ${exportFormat === format ? 'border-primary bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:border-primary/50'}`}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </div>

              {/* Columns Selection */}
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <LayoutGrid size={16} /> Select Columns
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_COLUMNS.map(col => (
                    <button 
                      key={col}
                      onClick={() => toggleColumn(col)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${selectedColumns.includes(col) ? 'bg-primary/10 border-primary text-primary' : 'bg-background border-border text-muted-foreground hover:bg-accent'}`}
                    >
                      {selectedColumns.includes(col) && <Check size={12} />}
                      {col}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border bg-muted/20 flex justify-between items-center">
              <span className="text-xs font-medium text-muted-foreground bg-background px-3 py-1.5 rounded-full border border-border">
                {selectedColumns.length} columns selected
              </span>
              <div className="flex gap-3">
                <button onClick={onClose} disabled={isExporting} className="px-4 py-2 text-sm font-medium text-foreground bg-background border border-border hover:bg-accent rounded-lg transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleExport}
                  disabled={isExporting || selectedColumns.length === 0}
                  className="px-6 py-2 text-sm font-semibold text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-all shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isExporting ? (
                    <span className="animate-pulse">Generating...</span>
                  ) : (
                    <><DownloadCloud size={16} /> Download</>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
