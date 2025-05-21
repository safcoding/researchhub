'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/navbar';
import Link from 'next/link';

type Publication = {
  id: number;
  title: string;
  author: string;
  type: string;
  category: string;
  date: string;
  year: string;
  file?: File | null;
};

const PublicationsUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [publicationData, setPublicationData] = useState({
    title: '',
    author: '',
    type: 'Article',
    category: 'Journal',
    date: '',
  });

  //placeholder fake ahh data
  const [publications, setPublications] = useState<Publication[]>([
   { id: 1, title: 'Advanced Machine Learning Techniques', author: 'Dr. Smith', type: 'Article', category: 'Journal', date: '2023-01-15', year: '2023' },
    { id: 2, title: 'Quantum Computing Applications', author: 'Dr. Johnson', type: 'Review', category: 'Conference', date: '2023-02-20', year: '2023' },
    { id: 3, title: 'Sustainable Energy Solutions', author: 'Dr. Lee', type: 'Article', category: 'Journal', date: '2023-03-10', year: '2023' },
    { id: 4, title: 'Neural Networks in Healthcare', author: 'Dr. Chen', type: 'Article', category: 'Journal', date: '2023-01-25', year: '2023' },
    { id: 5, title: 'Blockchain for Supply Chain', author: 'Dr. Wilson', type: 'Review', category: 'Conference', date: '2023-02-15', year: '2023' },
    { id: 6, title: 'AI in Financial Markets', author: 'Dr. Brown', type: 'Article', category: 'Journal', date: '2023-03-05', year: '2023' },
    { id: 7, title: 'Cybersecurity Trends 2023', author: 'Dr. Taylor', type: 'Article', category: 'Journal', date: '2023-01-30', year: '2023' },
    { id: 8, title: 'IoT in Smart Cities', author: 'Dr. Martinez', type: 'Review', category: 'Conference', date: '2023-02-28', year: '2023' },
    { id: 9, title: 'Biomedical Engineering Advances', author: 'Dr. Anderson', type: 'Article', category: 'Journal', date: '2023-03-15', year: '2023' },
    { id: 10, title: 'Data Privacy Regulations', author: 'Dr. Thomas', type: 'Article', category: 'Journal', date: '2022-01-10', year: '2022' },
    { id: 11, title: 'Augmented Reality in Education', author: 'Dr. White', type: 'Review', category: 'Conference', date: '2022-02-05', year: '2022' },
    { id: 12, title: 'Climate Change Modeling', author: 'Dr. Harris', type: 'Article', category: 'Journal', date: '2022-03-20', year: '2022' },
    { id: 13, title: '5G Network Security', author: 'Dr. Clark', type: 'Article', category: 'Journal', date: '2022-01-20', year: '2022' },
    { id: 14, title: 'Robotics in Manufacturing', author: 'Dr. Lewis', type: 'Review', category: 'Conference', date: '2022-02-10', year: '2022' },
    { id: 15, title: 'Genomic Data Analysis', author: 'Dr. Walker', type: 'Article', category: 'Journal', date: '2022-03-25', year: '2022' },
  ]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPublicationData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpload = () => {
    if (!file) {
      alert('Please select a PDF file to upload.');
      return;
    }

    if (!publicationData.title || !publicationData.author || !publicationData.date) {
      alert('Please fill in all required fields.');
      return;
    }

    const year = new Date(publicationData.date).getFullYear().toString();
    
    if (editingId !== null) {
      // Update existing publication
      setPublications(publications.map(pub => 
        pub.id === editingId ? { ...publicationData, id: editingId, year, file } : pub
      ));
      setEditingId(null);
    } else {
      // Add new publication
      const newPublication: Publication = {
        id: publications.length > 0 ? Math.max(...publications.map(p => p.id)) + 1 : 1,
        ...publicationData,
        year,
        file
      };
      setPublications([...publications, newPublication]);
    }

    // Reset form
    setPublicationData({
      title: '',
      author: '',
      type: 'Article',
      category: 'Journal',
      date: '',
    });
    setFile(null);
    
    alert(`Publication "${publicationData.title}" ${editingId !== null ? 'updated' : 'uploaded'} successfully!`);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this publication?')) {
      setPublications(publications.filter(pub => pub.id !== id));
    }
  };

  const getPdfLink = (id: number) => {
    return `https://www.utm.my/wp-content/uploads/2023/05/placeholder-publication-${id}.pdf`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Main Content - now full width since sidebar is removed */}
        <div className="flex-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              {editingId !== null ? 'Edit Publication' : 'Add New Publication'}
            </h1>
            
            {/* Form Section */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PDF File*</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>

              <div className="border-t pt-4 flex justify-between">
                {editingId !== null && (
                  <button
                    onClick={() => {
                      setEditingId(null);
                      setPublicationData({
                        title: '',
                        author: '',
                        type: 'Article',
                        category: 'Journal',
                        date: '',
                      });
                      setFile(null);
                    }}
                    className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 ml-auto"
                >
                  {editingId !== null ? 'Update Publication' : 'Upload Publication'}
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
                    <th className="text-left px-4 py-2">Actions</th>
                    <th className="text-left px-4 py-2">PDF</th>
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
                        <td className="px-4 py-2">
                          <a 
                            href={getPdfLink(pub.id)} 
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