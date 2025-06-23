import React from 'react';

interface LabSidebarProps {
  availableLabTypes: string[];
  selectedLabType: string;
  setSelectedLabType: (type: string) => void;
  currentLabs: any[];
}

export const LabSidebar: React.FC<LabSidebarProps> = ({
  availableLabTypes,
  selectedLabType,
  setSelectedLabType,
  currentLabs
}) => {
  return (
    <div className="w-80 bg-gray-100 p-4 border-r border-gray-200">
      <h2 className="text-lg font-bold mb-4">MJIIT Labs</h2>
      <div className="space-y-2">
        {availableLabTypes.map((labType) => (
          <button
                  key={labType}
                  onClick={() => setSelectedLabType(labType)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    selectedLabType === labType 
                      ? 'text-white shadow-md' 
                      : 'bg-white text-gray-800 hover:bg-gray-200'
                  }`}
                  style={selectedLabType === labType ? { backgroundColor: '#2B9167' } : {}}
                >
             {labType}
          </button>
        ))}
      </div>
      
      {/* Lab Type Stats */}
      <div className="mt-6 p-4 bg-white rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Lab Type Statistics</h3>
        <div className="space-y-1 text-sm">
          <div>Total Labs: {currentLabs.length}</div>
          <div>Active Labs: {currentLabs.filter(lab => lab.LAB_STATUS === 'Active').length}</div>
        </div>
      </div>
    </div>
  );
};