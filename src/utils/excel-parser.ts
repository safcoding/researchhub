import * as XLSX from 'xlsx';
import type { Grant } from '@/hooks/grant-logic';

interface ExcelRow {
  COST_CENTER_CODE?: string;
  PL_STAFF_NO?: number | string;
  PL_NAME?: string;
  PTJ_RESEARCH_ALLIANCE?: string;
  RESEARCH_GROUP?: string;
  PROJECT_TITLE?: string;
  PRO_DATESTART?: string;
  PRO_DATEEND?: string;
  PROJECT_YEAR?: string;
  GRANT_TYPE?: string;
  PROJECT_STATUS?: string;
  SPONSOR_CATEGORY?: string;
  SUBSPONSOR_NAME?: string;
  PRO_APPROVED?: number | string;
  [key: string]: unknown;
}

export async function parseExcelFile(file: File): Promise<Omit<Grant, 'PROJECTID'>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file data'));
          return;
        }
        
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Check if there are any sheets
        if (workbook.SheetNames.length === 0) {
          reject(new Error('Excel file does not contain any sheets'));
          return;
        }
        
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          reject(new Error('Could not find sheet in Excel file'));
          return;
        }
        
        const worksheet = workbook.Sheets[sheetName];
        if (!worksheet) {
          reject(new Error(`Could not find worksheet for sheet ${sheetName}`));
          return;
        }
        
        // Convert Excel data to JSON
        const jsonData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
        
        // Map Excel columns to Grant interface
        const grants = jsonData.map((row: ExcelRow) => ({
          COST_CENTER_CODE: row.COST_CENTER_CODE ?? '',
          PL_STAFF_NO: Number(row.PL_STAFF_NO ?? 0),
          PL_NAME: row.PL_NAME ?? '',
          PTJ_RESEARCH_ALLIANCE: row.PTJ_RESEARCH_ALLIANCE ?? '',
          RESEARCH_GROUP: row.RESEARCH_GROUP ?? '',          PROJECT_TITLE: row.PROJECT_TITLE ?? '',
          PRO_DATESTART: row.PRO_DATESTART ?? '',
          PRO_DATEEND: row.PRO_DATEEND ?? '',
          PROJECT_YEAR: row.PROJECT_YEAR ?? '',
          GRANT_TYPE: row.GRANT_TYPE ?? '',
          PROJECT_STATUS: row.PROJECT_STATUS ?? '',
          SPONSOR_CATEGORY: row.SPONSOR_CATEGORY ?? '',
          SUBSPONSOR_NAME: row.SUBSPONSOR_NAME ?? '',
          PRO_APPROVED: Number(row.PRO_APPROVED ?? 0)
        }));
        
        resolve(grants);
      } catch (error) {
        reject(error instanceof Error ? error : new Error('Unknown error parsing Excel file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsBinaryString(file);
  });
}
