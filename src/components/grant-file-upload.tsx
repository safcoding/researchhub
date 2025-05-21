import React, { useState } from 'react';
import { parseExcelFile } from '@/utils/excel-parser';
import { uploadFile } from '@/utils/storage-service';
import type { Grant } from '@/hooks/grant-logic';

interface GrantFileUploadProps {
  onUploadComplete: (grants: Omit<Grant, 'PROJECTID'>[], filePath: string) => void;
  onCancel: () => void;
}

export function GrantFileUpload({ onUploadComplete, onCancel }: GrantFileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setParsedData] = useState<Omit<Grant, 'PROJECTID'>[] | null>(null);
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Only accept Excel files
    if (!(/\.(xlsx|xls)$/).exec(selectedFile.name)) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }

    setFile(selectedFile);
    setError(null);
    
    try {
      setLoading(true);
      const parsedData = await parseExcelFile(selectedFile);
      setParsedData(parsedData);
    } catch (err) {
      setError('Error parsing Excel file. Please check the format.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };  const handleUpload = async () => {
    if (!file || !preview) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Upload file to Supabase Storage
      console.log('Starting file upload process...');
      const filePath = await uploadFile(file);
      console.log('File upload successful, got path:', filePath);
      
      // Pass the parsed data and file path to parent component
      onUploadComplete(preview, filePath);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('Error in handleUpload:', errorMessage, err);
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Upload Grant Data</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
          <div className="mb-6">
          <label htmlFor="grant-file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Upload Excel File
          </label>
          <input
            id="grant-file-upload"
            type="file"
            onChange={handleFileChange}
            accept=".xlsx,.xls"
            aria-label="Upload Excel file"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
          />
          <p className="text-sm text-gray-500">Upload an Excel file containing grant data</p>
        </div>
        
        {loading && <p className="text-center">Processing...</p>}
        
        {preview && preview.length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Preview ({preview.length} grants found):</h3>
            <div className="overflow-x-auto max-h-[40vh]">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs">COST CENTER</th>
                    <th className="px-3 py-2 text-left text-xs">PL NAME</th>
                    <th className="px-3 py-2 text-left text-xs">PROJECT TITLE</th>
                    <th className="px-3 py-2 text-left text-xs">START DATE</th>
                    <th className="px-3 py-2 text-left text-xs">GRANT TYPE</th>
                    <th className="px-3 py-2 text-left text-xs">STATUS</th>
                    <th className="px-3 py-2 text-left text-xs">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.slice(0, 5).map((grant, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-3 py-2 text-xs">{grant.COST_CENTER_CODE}</td>
                      <td className="px-3 py-2 text-xs">{grant.PL_NAME}</td>
                      <td className="px-3 py-2 text-xs">{grant.PROJECT_TITLE}</td>
                      <td className="px-3 py-2 text-xs">{grant.PRO_DATESTART}</td>
                      <td className="px-3 py-2 text-xs">{grant.GRANT_TYPE}</td>
                      <td className="px-3 py-2 text-xs">{grant.PROJECT_STATUS}</td>
                      <td className="px-3 py-2 text-xs">${grant.PRO_APPROVED}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {preview.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">Showing 5 of {preview.length} grants</p>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onCancel}
            className="bg-gray-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
            disabled={!preview || loading}
          >
            Upload Data
          </button>
        </div>
      </div>
    </div>
  );
}
