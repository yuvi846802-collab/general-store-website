import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export type ExportFormat = 'csv' | 'xlsx' | 'json' | 'pdf';

export interface ExportConfig {
  format: ExportFormat;
  filename: string;
  columns: string[];
}

export const exportService = {
  exportData: (data: any[], config: ExportConfig) => {
    // Filter data based on selected columns
    const filteredData = data.map(item => {
      const filteredItem: any = {};
      config.columns.forEach(col => {
        if (col === 'Product Name') filteredItem[col] = item.name || '';
        else if (col === 'SKU') filteredItem[col] = item.sku || item.id || '';
        else if (col === 'Category') filteredItem[col] = item.category || '';
        else if (col === 'Price') filteredItem[col] = item.price || '0';
        else if (col === 'Inventory') filteredItem[col] = item.stock ?? item.inventory ?? 0;
        else if (col === 'Status') filteredItem[col] = item.status || 'active';
        else filteredItem[col] = item[col.toLowerCase()] ?? item[col] ?? '';
      });
      return filteredItem;
    });

    switch (config.format) {
      case 'csv':
        exportService.downloadCSV(filteredData, config.filename);
        break;
      case 'xlsx':
        exportService.downloadExcel(filteredData, config.filename);
        break;
      case 'json':
        exportService.downloadJSON(filteredData, config.filename);
        break;
      case 'pdf':
        exportService.downloadPDF(filteredData, config.filename, config.columns);
        break;
    }
  },

  downloadCSV: (data: any[], filename: string) => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    exportService.triggerDownload(blob, `${filename}.csv`);
  },

  downloadExcel: (data: any[], filename: string) => {
    try {
      // Fallback to default if XLSX is nested (Vite CJS interop)
      const xlsxLib = (XLSX as any).default || XLSX;
      const worksheet = xlsxLib.utils.json_to_sheet(data);
      const workbook = xlsxLib.utils.book_new();
      xlsxLib.utils.book_append_sheet(workbook, worksheet, 'Products');
      
      // Generate ArrayBuffer and use our robust triggerDownload
      const excelBuffer = xlsxLib.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      exportService.triggerDownload(blob, `${filename}.xlsx`);
    } catch (err) {
      console.error("Excel generation failed, falling back to CSV", err);
      exportService.downloadCSV(data, filename);
    }
  },

  downloadJSON: (data: any[], filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    exportService.triggerDownload(blob, `${filename}.json`);
  },

  downloadPDF: (data: any[], filename: string, columns: string[]) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text('Hakeem Store - Exported Data', 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    // Table
    const tableData = data.map(row => columns.map(col => String(row[col])));
    
    autoTable(doc, {
      startY: 36,
      head: [columns],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [16, 185, 129] }, // Emerald 500
      styles: { fontSize: 9 },
    });

    doc.save(`${filename}.pdf`);
  },

  triggerDownload: (blob: Blob, filename: string) => {
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
};
