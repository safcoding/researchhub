'use client';

import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { testSupabaseConnection, testStorageConnection } from '@/utils/test-crud';

export default function TestPage() {
  const [connectionResult, setConnectionResult] = useState<{success?: boolean; count?: number; error?: string} | null>(null);
  const [storageResult, setStorageResult] = useState<{success?: boolean; buckets?: any[]; error?: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const runConnectionTest = async () => {
    setLoading(true);
    setConnectionResult(null);
    
    try {
      const result = await testSupabaseConnection();
      setConnectionResult(result);
    } catch (err) {
      setConnectionResult({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  const runStorageTest = async () => {
    setLoading(true);
    setStorageResult(null);
    
    try {
      const result = await testStorageConnection();
      setStorageResult(result);
    } catch (err) {
      setStorageResult({ success: false, error: err instanceof Error ? err.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Supabase Connection Test</h1>
        
        <div className="flex gap-4 mb-8">
          <button 
            onClick={runConnectionTest}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-blue-400"
          >
            Test Database Connection
          </button>
          
          <button 
            onClick={runStorageTest}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-green-400"
          >
            Test Storage Connection
          </button>
        </div>
        
        {loading && <p className="text-gray-600 mb-4">Running test...</p>}
        
        {connectionResult && (
          <div className={`p-4 rounded mb-6 ${connectionResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
            <h2 className="font-bold mb-2">Database Connection Test</h2>
            {connectionResult.success ? (
              <p className="text-green-700">
                Connection successful! Found {connectionResult.count} grants in the database.
              </p>
            ) : (
              <p className="text-red-700">
                Connection failed: {connectionResult.error}
              </p>
            )}
          </div>
        )}
        
        {storageResult && (
          <div className={`p-4 rounded mb-6 ${storageResult.success ? 'bg-green-100 border border-green-400' : 'bg-red-100 border border-red-400'}`}>
            <h2 className="font-bold mb-2">Storage Connection Test</h2>
            {storageResult.success ? (
              <>
                <p className="text-green-700 mb-2">
                  Storage connection successful! Found {storageResult.buckets?.length} buckets.
                </p>
                {storageResult.buckets && storageResult.buckets.length > 0 && (
                  <div>
                    <p className="font-semibold">Bucket names:</p>
                    <ul className="list-disc ml-6">
                      {storageResult.buckets.map((bucket, index) => (
                        <li key={index}>{bucket.name}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <p className="text-red-700">
                Storage connection failed: {storageResult.error}
              </p>
            )}
          </div>
        )}
        
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">Testing Instructions</h2>
          <ol className="list-decimal ml-6 space-y-2">
            <li>Click "Test Database Connection" to check if the application can connect to the Supabase database and query the 'grant' table.</li>
            <li>Click "Test Storage Connection" to check if the application can connect to Supabase Storage and list available buckets.</li>
            <li>If tests fail, check browser console for detailed error messages.</li>
            <li>If the API key error persists, verify that the key is correctly included in the request headers.</li>
          </ol>
        </div>
      </div>
    </>
  );
}
