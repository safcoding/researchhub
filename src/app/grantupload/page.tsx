'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';

const GrantUpload = () => {
  const [file, setFile] = useState(null);
  const router = useRouter();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (file) {
      alert(`File ${file.name} uploaded successfully!`);
      // Add logic to handle file upload here
      router.push('/grant'); // Redirect to the grant page after upload
    } else {
      alert('Please select a file to upload.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <Navbar /> {/* Make sure this is the first element */}
      <h1 className="text-3xl font-bold mb-6">Grant File Upload</h1>
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Upload File
        </button>
      </div>
    </div>
  );
};

export default GrantUpload;