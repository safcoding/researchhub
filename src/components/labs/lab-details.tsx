import React from 'react';
import { type Lab } from '@/hooks/logic/lab-logic';
import { EquipmentBadges } from './equiment-badge';

interface LabModalProps {
  lab: Lab;
  isOpen: boolean;
  onClose: () => void;
}

export const LabModal: React.FC<LabModalProps> = ({ lab, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{lab.LAB_NAME}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Head</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lab.LAB_HEAD || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lab Type</label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {lab.LAB_TYPE}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  lab.LAB_STATUS === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : lab.LAB_STATUS === 'Inactive'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lab.LAB_STATUS}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lab.LOCATION || 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lab.CONTACT_PHONE ?? 'Not specified'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{lab.LAB_HEAD_EMAIL ?? 'Not specified'}</p>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Area</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[80px]">
                  {lab.RESEARCH_AREA ?? 'No research area specified'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg min-h-[100px]">
                  {lab.LAB_DESCRIPTION || 'No description available'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Equipment List</label>
                <div className="bg-gray-50 p-3 rounded-lg min-h-[120px]">
                  <EquipmentBadges equipmentList={lab.EQUIPMENT_LIST} maxVisible={10} clickable={false} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
          {lab.LAB_HEAD_EMAIL && (
            <button
              onClick={() => {
                window.location.href = `mailto:${lab.LAB_HEAD_EMAIL}?subject=Inquiry about ${lab.LAB_NAME}&body=Dear ${lab.LAB_HEAD},%0D%0A%0D%0AI am writing to inquire about your laboratory.%0D%0A%0D%0ABest regards,`;
              }}
              className="px-4 py-2 text-white rounded-lg transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#2B9167' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2v10a2 2 0 002 2z" />
              </svg>
              Email Lab Head
            </button>
          )}
        </div>
      </div>
    </div>
  );
};