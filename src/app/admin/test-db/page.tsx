'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function TestDatabasePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    try {
      setLoading(true);
      setResult('Testing connection...');
      
      const supabase = createClient();
      console.log('Supabase client created');
      
      // Test reading
      const { data: readData, error: readError } = await supabase
        .from('about_content')
        .select('*');
      
      console.log('Read result:', { readData, readError });
      
      if (readError) {
        setResult(`Read Error: ${readError.message}`);
        return;
      }
      
      setResult(`Read Success: Found ${readData?.length || 0} records\n${JSON.stringify(readData, null, 2)}`);
      
    } catch (error) {
      console.error('Test failed:', error);
      setResult(`Test failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testInsert = async () => {
    try {
      setLoading(true);
      setResult('Testing insert...');
      
      const supabase = createClient();
      
      const testContent = {
        id: 1,
        title: 'Test Title - ' + new Date().toISOString(),
        intro_paragraph: 'Test intro paragraph',
        main_paragraph: 'Test main paragraph',
        conclusion_paragraph: 'Test conclusion paragraph',
        closing_statement: 'Test closing statement',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Try insert
      const { data: insertData, error: insertError } = await supabase
        .from('about_content')
        .upsert([testContent])
        .select();
      
      console.log('Insert result:', { insertData, insertError });
      
      if (insertError) {
        setResult(`Insert Error: ${insertError.message}`);
        return;
      }
      
      setResult(`Insert Success:\n${JSON.stringify(insertData, null, 2)}`);
      
    } catch (error) {
      console.error('Insert test failed:', error);
      setResult(`Insert test failed: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Database Connection Test</h1>
          
          <div className="space-y-4 mb-8">
            <button
              onClick={testConnection}
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Read Connection'}
            </button>
            
            <button
              onClick={testInsert}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Testing...' : 'Test Insert/Upsert'}
            </button>
          </div>

          <div className="bg-gray-100 p-4 rounded-md">
            <h3 className="font-semibold mb-2">Test Result:</h3>
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
