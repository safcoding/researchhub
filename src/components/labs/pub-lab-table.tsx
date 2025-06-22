import React from 'react';
import { type Lab } from '@/hooks/lab-logic';
import { EquipmentBadges } from './equiment-badge';

interface LabsTableProps {
  labs: Lab[];
  selectedEquipment: string;
  onLabClick: (lab: Lab) => void;
  onEquipmentClick: (equipment: string) => void;
}

export const LabsTable: React.FC<LabsTableProps> = ({
  labs,
  selectedEquipment,
  onLabClick,
  onEquipmentClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
        <p className="text-xs text-gray-600">
          💡 <strong>Tip:</strong> Click on <strong>lab names</strong> to view details, or click on <strong>equipment badges</strong> to filter labs by that equipment
        </p>
      </div>
      
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Lab Name</th>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Lab Head</th>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/8">Status</th>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Research Focus</th>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/5">Equipment</th>
            <th className="px-4 py-3 text-left font-medium text-white uppercase tracking-wider w-1/6">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {labs.map((lab) => (
            <tr 
              key={lab.LABID}
              className="hover:bg-blue-50 transition-colors group"
            >
              <td className="px-4 py-3">
                <div 
                  onClick={() => onLabClick(lab)}
                  className="font-medium text-gray-900 group-hover:text-blue-600 cursor-pointer"
                >
                  {lab.LAB_NAME}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                    {lab.LAB_DESCRIPTION ? lab.LAB_DESCRIPTION.substring(0, 60) + '...' : 'No description available'}
                  </p>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">{lab.LAB_HEAD}</td>
              <td className="px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  lab.LAB_STATUS === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : lab.LAB_STATUS === 'Inactive'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {lab.LAB_STATUS}
                </span>
              </td>
              <td className="px-4 py-3 text-gray-700 line-clamp-2">{lab.RESEARCH_AREA ?? 'Not specified'}</td>
              <td className="px-4 py-3">
                <EquipmentBadges 
                  equipmentList={lab.EQUIPMENT_LIST} 
                  maxVisible={2} 
                  clickable={true}
                  selectedEquipment={selectedEquipment}
                  onEquipmentClick={onEquipmentClick}
                />
              </td>
              <td className="px-4 py-3 text-gray-700">{lab.LOCATION}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};