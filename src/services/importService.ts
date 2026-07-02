import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { z } from 'zod';

export const importSchema = z.object({
  name: z.string().min(1, 'Product Name is required'),
  sku: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.string().or(z.number()).transform(val => String(val)),
  stock: z.string().or(z.number()).transform(val => Number(val)),
  status: z.enum(['active', 'draft', 'hidden']).optional().default('draft'),
  image: z.string().optional(),
});

export type ImportRow = z.infer<typeof importSchema>;

export interface ImportValidationResult {
  validRows: ImportRow[];
  errors: { row: number; error: string; data: any }[];
  totalRows: number;
}

export const importService = {
  parseCSV: (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: any) => resolve(results.data),
        error: (error: any) => reject(error),
      });
    });
  },

  parseExcel: (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(file);
    });
  },

  validateData: async (data: any[]): Promise<ImportValidationResult> => {
    const validRows: ImportRow[] = [];
    const errors: { row: number; error: string; data: any }[] = [];

    data.forEach((row, index) => {
      // Normalize keys: convert to lowercase and remove spaces for flexible mapping
      const normalizedRow: any = {};
      Object.keys(row).forEach(key => {
        const normKey = key.toLowerCase().trim().replace(/ /g, '');
        normalizedRow[normKey] = row[key];
      });

      // Map common CSV headers to schema keys
      const mappedRow = {
        name: normalizedRow.name || normalizedRow.productname || normalizedRow.title || '',
        sku: normalizedRow.sku || normalizedRow.itemcode || '',
        category: normalizedRow.category || normalizedRow.type || '',
        price: normalizedRow.price || normalizedRow.cost || '',
        stock: normalizedRow.stock || normalizedRow.inventory || normalizedRow.qty || normalizedRow.quantity || 0,
        status: normalizedRow.status || 'draft',
        image: normalizedRow.image || normalizedRow.imageurl || '',
      };

      try {
        const validated = importSchema.parse(mappedRow);
        validRows.push(validated);
      } catch (e: any) {
        errors.push({
          row: index + 2, // Excel/CSV rows are 1-indexed and have a header row
          error: e.errors?.[0]?.message || 'Invalid row data',
          data: row
        });
      }
    });

    return {
      validRows,
      errors,
      totalRows: data.length
    };
  }
};
