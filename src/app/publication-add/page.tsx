'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import { PublicationLogic, type Publication } from '@/hooks/publication-logic';

const PublicationsUpload: React.FC = () => {
  const {
    publications,
    loading,
    error,
    addPublication,
    updatePublication,
    deletePublication,
    uploadPDF
  } = PublicationLogic();

  const [file, setFile] = useState<File | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [publicationData, setPublicationData] = useState({
    title: '',
    author: '',
    type: 'Article',
    category: 'Journal',
    date: '',
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPublicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      if (!publicationData.title || !publicationData.author || !publicationData.date) {
        alert('Please fill in all required fields.');
        return;
      }

      if (editingId !== null) {
        await updatePublication(editingId, publicationData);
        if (file) {
          try {
            await uploadPDF(file, editingId);
          } catch (uploadErr) {
            console.error('Error uploading PDF:', uploadErr);
            alert('Publication updated but PDF upload failed. Please try uploading the PDF again.');
          }
        }
      } else {
        const newPub = await addPublication(publicationData);
        if (!newPub || !newPub.id) {
          throw new Error('Failed to create publication');
        }

        if (file) {
          try {
            await uploadPDF(file, newPub.id);
          } catch (uploadErr) {
            console.error('Error uploading PDF:', uploadErr);
            alert('Publication added but PDF upload failed. You can try again by editing.');
          }
        }
      }

      resetForm();
      alert(`Publication ${editingId !== null ? 'updated' : 'added'} successfully!`);
    } catch (err) {
      console.error('Error handling publication:', err);
      alert('Error: ' + (err instanceof Error ? err.message : 'An error occurred'));
    }
  };

  const handleEdit = (publication: Publication) => {
    setPublicationData({
      title: publication.title,
      author: publication.author,
      type: publication.type,
      category: publication.category,
      date: publication.date,
    });
    setEditingId(publication.id);
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this publication?')) {
      try {
        await deletePublication(id);
        alert('Publication deleted successfully');
      } catch (err) {
        alert('Error deleting publication: ' + (err instanceof Error ? err.message : 'An error occurred'));
      }
    }
  };

  const resetForm = () => {
    setPublicationData({
      title: '',
      author: '',
      type: 'Article',
      category: 'Journal',
      date: '',
    });
    setFile(null);
    setEditingId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex justify-center items-center">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex-1">
          {/* Form Section */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId !== null ? 'Edit Publication' : 'Add New Publication'}
            </h1>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title*</label>
                  <input
                    type="text"
                    name="title"
                    value={publicationData.title}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Author Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author*</label>
                  <input
                    type="text"
                    name="author"
                    value={publicationData.author}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* Type Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
                  <select
                    name="type"
                    value={publicationData.type}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Article">Article</option>
                    <option value="Review">Review</option>
                  </select>
                </div>

                {/* Category Select */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    name="category"
                    value={publicationData.category}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Journal">Journal</option>
                    <option value="Conference">Conference</option>
                  </select>
                </div>

                {/* Date Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date*</label>
                  <input
                    type="date"
                    name="date"
                    value={publicationData.date}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>

                {/* File Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF File
                  </label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              {/* Form Buttons */}
              <div className="border-t pt-4 flex justify-between">
                {editingId !== null && (
                  <button
                    onClick={resetForm}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ml-auto"
                >
                  {editingId !== null ? 'Update Publication' : 'Add Publication'}
                </button>
              </div>
            </div>
          </div>

          {/* Publications Table */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Current Publications</h2>

            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-4 py-2">Title</th>
                    <th className="text-left px-4 py-2">Author</th>
                    <th className="text-left px-4 py-2">Type</th>
                    <th className="text-left px-4 py-2">Category</th>
                    <th className="text-left px-4 py-2">Date</th>
                    <th className="text-left px-4 py-2">PDF</th>
                    <th className="text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {publications.length > 0 ? (
                    publications.map(pub => (
                      <tr key={pub.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{pub.title}</td>
                        <td className="px-4 py-2">{pub.author}</td>
                        <td className="px-4 py-2">{pub.type}</td>
                        <td className="px-4 py-2">{pub.category}</td>
                        <td className="px-4 py-2">{pub.date}</td>
                        <td className="px-4 py-2">
                          {pub.file_url ? (
                            <a
                              href={pub.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                              </svg>
                              View PDF
                            </a>
                          ) : (
                            <span className="text-gray-400">No PDF</span>
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(pub)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(pub.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                        No publications found. Add your first publication above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicationsUpload;
