import { useState, useEffect } from 'react';
import { supabase } from '@/lib/db-connect';

interface FileListItem {
  name: string;
  path: string;
  url: string;
  created_at: string;
  size: number;
}

interface UploadedFilesModalProps {
  onClose: () => void;
}

export function UploadedFilesModal({ onClose }: UploadedFilesModalProps) {
  const [files, setFiles] = useState<FileListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchFiles() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the list of files from the grants bucket
        const { data, error } = await supabase.storage
          .from('grants')
          .list();
        
        if (error) {
          throw error;
        }
        
        if (!data) {
          setFiles([]);
          return;
        }

        // Transform the data to include public URLs
        const filesWithUrls = await Promise.all(
          data.map(async (file) => {
            const { data: urlData } = supabase.storage
              .from('grants')
              .getPublicUrl(file.name);

            return {
              name: file.name,
              path: file.name,
              url: urlData?.publicUrl || '',
              created_at: file.created_at || '',
              size: file.metadata?.size || 0
            };
          })
        );
        
        setFiles(filesWithUrls);
      } catch (err) {
        console.error('Error fetching files:', err);
        setError(err instanceof Error ? err.message : 'Failed to load files');
      } finally {
        setLoading(false);
      }
    }
    
    void fetchFiles();
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getFileNameWithoutTimestamp = (filename: string): string => {
    // Remove timestamp prefix (e.g., "1620000000_filename.xlsx" -> "filename.xlsx")
    const parts = filename.split('_');
    if (parts.length > 1 && !isNaN(Number(parts[0]))) {
      return parts.slice(1).join('_');
    }
    return filename;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-3/4 max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Uploaded Files</h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2">Loading files...</p>
          </div>
        ) : (
          <>
            {files.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No files have been uploaded yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded At</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {files.map((file) => (
                      <tr key={file.path}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getFileNameWithoutTimestamp(file.name)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatFileSize(file.size)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatDate(file.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a 
                            href={file.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
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
        
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
