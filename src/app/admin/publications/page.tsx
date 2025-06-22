'use client';

import React, { useState } from 'react';
import { PublicationLogic, type Publication } from '@/hooks/publication-logic';

import { AdminSidebar } from "@/components/admin-sidebar/sidebar-content"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"


const PublicationsUpload: React.FC = () => {
  const { publications, loading, error, addPublication, updatePublication, deletePublication } = PublicationLogic();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [publicationData, setPublicationData] = useState({
    pub_refno: '',
    status: '',
    type: '',
    category: '',
    journal: '',
    title: '',
    impact: 0,
    date: '',
    level: '',
    author_name: '', // Added author_name, made it an array
    author_id: 0,
    research_alliance: '',
    rg_name: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPublicationData(prev => ({
      ...prev,
      [name]: name === 'impact' || name === 'author_id' ? Number(value) : value
    }));
  };

  const resetForm = () => {
    setPublicationData({
      pub_refno: '',
      status: 'Published',
      type: 'Book Chapter', //changed this to default to Book Chapter
      category: 'Journal',
      journal: '',
      title: '',
      impact: 0,
      date: '',
      level: 'International',
      author_name: '',
      author_id: 0,
      research_alliance: '',
      rg_name: ''
    });
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!publicationData.title || !publicationData.pub_refno || !publicationData.date) {
        alert('Please fill in all required fields.');
        return;
      }

      if (editingId !== null) {
        await updatePublication(editingId, publicationData);
        alert('Publication updated successfully!');
      } else {
        await addPublication(publicationData);
        alert('Publication added successfully!');
      }

      resetForm();
    } catch (err) {
      console.error('Error handling publication:', err);
      alert('An error occurred while saving the publication');
    }
  };

  const handleEdit = (publication: Publication) => {
    setPublicationData({
      pub_refno: publication.pub_refno ?? '',
      status: publication.status ?? '',
      type: publication.type ?? '',
      category: publication.category ?? '',
      journal: publication.journal ?? '',
      title: publication.title ?? '',
      impact: publication.impact ?? 0,
      date: publication.date ?? '',
      level: publication.level ?? '',
      author_name: publication.author_name ?? '',
      author_id: publication.author_id ?? 0,
      research_alliance: publication.research_alliance ?? '',
      rg_name: publication.rg_name ?? ''
    });
    setEditingId(publication.id ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this publication?')) {
      try {
        await deletePublication(id);
        alert('Publication deleted successfully');
      } catch (err) {
        alert('Error deleting publication');
      }
    }
  };


 return (
      <SidebarProvider
      style={
        {
          "--sidebar-width": "19rem",
        } as React.CSSProperties
      }
    >
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </header>

    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            {editingId ? 'Edit Publication' : 'Add New Publication'}
          </h1>
          

<div className="mb-8">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">Basic Info</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Reference Number*</label>
      <input
        type="text"
        name="pub_refno"
        value={publicationData.pub_refno}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Journal*</label>
      <input
        type="text"
        name="journal"
        value={publicationData.journal}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Impact Factor</label>
      <input
        type="number"
        name="impact"
        value={publicationData.impact}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        step="0.01"
        min="0"
      />
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Level*</label>
      <select
        name="level"
        value={publicationData.level}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="International">International</option>
        <option value="National">National</option>
        <option value="Local">Local</option>
      </select>
    </div>
  </div>
</div>

{/* ========== Section: Publication Details ========== */}
<div className="mb-8">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">Publication Details</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Type*</label>
      <select
        name="type"
        value={publicationData.type}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Book Chapter">Book Chapter</option>
        <option value="Research Book">Research Book</option>
        <option value="Scopus">Scopus</option>
        <option value="Web of Science">Web of Science</option>
        <option value="Conference/Proceeding">Conference/Proceeding</option>
        <option value="Others">Others</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
      <select
        name="category"
        value={publicationData.category}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      >
        <option value="Journal">Journal</option>
        <option value="Conference">Conference</option>
        <option value="Book">Book</option>
      </select>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Research Alliance</label>
      <input
        type="text"
        name="research_alliance"
        value={publicationData.research_alliance}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Research Group</label>
      <input
        type="text"
        name="rg_name"
        value={publicationData.rg_name}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
      />
    </div>
  </div>
</div>

{/* ========== Section: Author Info ========== */}
<div className="mb-8">
  <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-1">Author Info</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Author Name*</label>
      <input
        type="text"
        name="author_name"
        value={publicationData.author_name}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Author ID*</label>
      <input
        type="number"
        name="author_id"
        value={publicationData.author_id}
        onChange={handleInputChange}
        className="w-full p-2 border rounded"
        required
      />
    </div>
  </div>
</div>


          <div className="mt-6 flex justify-end space-x-4">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'} Publication
            </button>
          </div>
        </form>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Publications List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-4 py-2">Ref No</th>
                  <th className="text-left px-4 py-2">Title</th>
                  <th className="text-left px-4 py-2">Author</th> {/* Added author_name field */}
                  <th className="text-left px-4 py-2">Journal</th>
                  <th className="text-left px-4 py-2">Type</th>
                  <th className="text-left px-4 py-2">Date</th>
                  <th className="text-left px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {publications.map(pub => (
                  <tr key={pub.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{pub.pub_refno}</td>
                    <td className="px-4 py-2">{pub.title}</td>
                    <td className="px-4 py-2">{pub.author_name}</td> {/* Added author_name field */}
                    <td className="px-4 py-2">{pub.journal}</td>
                    <td className="px-4 py-2">{pub.type}</td>
                    <td className="px-4 py-2">{pub.date}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEdit(pub)}
                        className="text-blue-600 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(pub.id!)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default PublicationsUpload;