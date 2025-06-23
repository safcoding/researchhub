'use client';

import React, { useState } from 'react';
import { useAboutContent } from '@/hooks/about-content';

export default function AdminAboutPage() {
  const { aboutContent, loading, error, updateAboutContent } = useAboutContent();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState(aboutContent);

  // Update form data when aboutContent changes
  React.useEffect(() => {
    setFormData(aboutContent);
  }, [aboutContent]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage('');
      
      const success = await updateAboutContent(formData);
      
      if (success) {
        setMessage('Content saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Error saving content');
      }
    } catch (err) {
      console.error('Error saving content:', err);
      setMessage('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleReset = () => {
    setFormData(aboutContent);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit About Page Content</h1>
          
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
            }`}>
              {message}
            </div>
          )}

          <div className="space-y-6">            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Page Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Intro Paragraph */}
            <div>
              <label htmlFor="intro_paragraph" className="block text-sm font-medium text-gray-700 mb-2">
                Introduction Paragraph
              </label>
              <textarea
                id="intro_paragraph"
                rows={4}
                value={formData.intro_paragraph}
                onChange={(e) => handleInputChange('intro_paragraph', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Main Paragraph */}
            <div>
              <label htmlFor="main_paragraph" className="block text-sm font-medium text-gray-700 mb-2">
                Main Content Paragraph
              </label>
              <textarea
                id="main_paragraph"
                rows={6}
                value={formData.main_paragraph}
                onChange={(e) => handleInputChange('main_paragraph', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Conclusion Paragraph */}
            <div>
              <label htmlFor="conclusion_paragraph" className="block text-sm font-medium text-gray-700 mb-2">
                Conclusion Paragraph
              </label>
              <textarea
                id="conclusion_paragraph"
                rows={4}
                value={formData.conclusion_paragraph}
                onChange={(e) => handleInputChange('conclusion_paragraph', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Closing Statement */}
            <div>
              <label htmlFor="closing_statement" className="block text-sm font-medium text-gray-700 mb-2">
                Closing Statement
              </label>
              <textarea
                id="closing_statement"
                rows={2}
                value={formData.closing_statement}
                onChange={(e) => handleInputChange('closing_statement', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={handleReset}
              disabled={loading}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              Reset Changes
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Preview</h3>
            <p className="text-sm text-blue-700">
              Changes will be reflected on the public About page after saving. 
              <a href="/about" target="_blank" className="underline ml-1">
                View public About page →
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
