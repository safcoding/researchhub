import React from 'react';

interface EquipmentBadgesProps {
  equipmentList: string | undefined;
  maxVisible?: number;
  clickable?: boolean;
  selectedEquipment?: string;
  onEquipmentClick?: (equipment: string) => void;
}

export const EquipmentBadges: React.FC<EquipmentBadgesProps> = ({ 
  equipmentList, 
  maxVisible = 3, 
  clickable = false,
  selectedEquipment = '',
  onEquipmentClick
}) => {
  const parseEquipmentList = (equipmentList: string | undefined) => {
    if (!equipmentList || equipmentList.trim() === '') {
      return [];
    }
    
    return equipmentList
      .split(/[,;\n\r]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const equipment = parseEquipmentList(equipmentList);
  
  if (equipment.length === 0) {
    return <span className="text-gray-400 text-xs">No equipment listed</span>;
  }

  const visibleEquipment = equipment.slice(0, maxVisible);
  const remainingCount = equipment.length - maxVisible;

  return (
    <div className="flex flex-wrap gap-1">
      {visibleEquipment.map((item, index) => (
        <span
          key={index}
          onClick={clickable ? (e) => {
            e.stopPropagation();
            onEquipmentClick?.(item);
          } : undefined}
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ${
            clickable ? 'cursor-pointer hover:bg-blue-200 transition-colors' : ''
          } ${selectedEquipment === item ? 'ring-2 ring-blue-500 bg-blue-200' : ''}`}
          title={clickable ? `Click to filter by: ${item}` : item}
        >
          {item.length > 12 ? `${item.substring(0, 12)}...` : item}
        </span>
      ))}
      {remainingCount > 0 && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
          +{remainingCount} more
        </span>
      )}
    </div>
  );
};