import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { GrantLogic } from '@/hooks/grant-logic';

interface FileBrowserProps {
  onSelectFile: (filePath: string) => void;
  onClose: () => void;
}

export function FileBrowser({ onSelectFile, onClose }: FileBrowserProps) {
  const [files, setFiles] = useState<{ name: string; path: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getFileUrl } = GrantLogic();
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        // Get list of files from Supabase Storage
        const supabase = createClient();
        const { data, error } = await supabase
          .storage
          .from('grants')
          .list();

        if (error) throw error;

        // Filter out folders and get only Excel files
        const excelFiles = data
          ?.filter((item: any) => !item.id.endsWith('/') && (item.name.endsWith('.xlsx') || item.name.endsWith('.xls')))
          .map((item: any) => {
            // Make sure we're using the correct path format that Supabase expects
            // This might just be the filename depending on how you've stored it
            const filePath = item.name;
            
            return {
              name: item.name,
              path: filePath,
              created_at: new Date(item.created_at || '').toLocaleString()
            };
          }) || [];

        console.log('Found Excel files:', excelFiles);
        setFiles(excelFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        console.error('Error fetching files:', err);
      } finally {
        setLoading(false);
      }
    };

    // Use void to handle the Promise
    void fetchFiles();
  }, []);  const handleFileSelect = (filePath: string) => {
    console.log('Selected file:', filePath);
    // Make sure we're using the filename directly for file selection
    // This ensures consistency across the app
    const fileName = filePath.includes('/') ? filePath.split('/').pop() : filePath;
    console.log('Using filename for selection:', fileName);
    onSelectFile(fileName ?? '');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Select Excel File</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <p className="text-center py-8">Loading files...</p>
        ) : (          <>
            {files.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No Excel files found. Please upload a file first.</p>
                <div className="bg-yellow-50 p-4 rounded-md text-left inline-block">
                  <h3 className="font-semibold text-yellow-800 mb-2">Storage Checklist:</h3>
                  <ul className="list-disc pl-5 text-sm text-yellow-700">
                    <li>Ensure your Supabase storage has a bucket named &quot;grants&quot;</li>
                    <li>Check that the bucket has proper access policies</li>
                    <li>Verify that your browser has permission to access Supabase storage</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <p className="mb-4 text-sm text-gray-600">
                  Select a file to view its grant data. After selecting a file, you will be able to see all grants associated with it.
                </p>
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Upload Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((file) => (
                      <tr key={file.path} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{file.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{file.created_at}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleFileSelect(file.path)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
                          >
                            Select
                          </button>
                          <a 
                            href={getFileUrl(file.path)} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
        
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}