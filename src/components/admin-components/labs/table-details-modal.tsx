
import React, { useEffect} from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import type { Lab } from "@/hooks/logic/lab-logic"
import { useLabEquipmentLogic } from "@/hooks/logic/lab-equipment-logic"

export default function LabDetailsModal({lab, onClose}: {lab: Lab; onClose: () => void}) {
  const { labEquipment, loading, fetchLabEquipment } = useLabEquipmentLogic();

useEffect(() => {
  fetchLabEquipment(lab.LABID);
}, [lab.LABID, fetchLabEquipment]);

return (
  <div
    className ="fixed inset-0 bg-black/30 transition-opacity"
    onClick={e => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    }}
  >
    <div
      className="relative ml-auto h-full w-full max-w-xl bg-white shadow-2xl rounded-l-2xl flex flex-col animate-slide-in-right"
      style={{ minWidth: 400 }}
    >
      <Card className="h-full w-full border-0 rounded-none p-0 flex flex-col">
        <CardHeader className="border-b px-6 pt-6 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">{lab.LAB_NAME}</CardTitle>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
          </div>
          <CardDescription className="mt-1 text-gray-500">{lab.LAB_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <section className='mb-10'>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xl text-gray-400">Lab Details</div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              <div>
                <div className="text-gray-400">Lab Type</div>
                <div className="font-medium">{lab.LAB_TYPE}</div>
              </div>
              <div>
                <div className="text-gray-400">Research Area</div>
                <div className="font-medium">{lab.RESEARCH_AREA}</div>
              </div>
              <div>
                <div className="text-gray-400">Location</div>
                <div className="font-medium">{lab.LOCATION}</div>
              </div>    
              <div>
                <div className="text-gray-400">Status</div>
                <div className="font-medium">{lab.LAB_STATUS}</div>
              </div> 
            </div>     
          </section>

          <section className='mb-10'>
            <div className="flex items-center justify-between mb-2"></div>
              <div className="text-xl text-gray-400">Contact Details</div>
            <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm">
              <div>
                <div className="text-gray-400">Lab Head</div>
                <div className="font-medium">{lab.LAB_HEAD}</div>
              </div>
              <div>
                <div className="text-gray-400">Lab Head Email</div>
                <div className="font-medium">{lab.LAB_HEAD_EMAIL}</div>
              </div>
              <div>
                <div className="text-gray-400">Phone Number</div>
                <div className="font-medium">{lab.CONTACT_PHONE}</div>
              </div>    
            </div>     
          </section>

          <section className='mb-10'>
            <div className="text-xl text-gray-400 mb-2">Lab Equipment</div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <ul>
                {labEquipment.length === 0 ? (
                  <li className="text-gray-500">No equipment assigned.</li>
                ) : (
                  labEquipment.map(eq => (
                    <li key={eq.id}>
                      {eq.equipment?.name || 'Unknown'} (Quantity: {eq.quantity})
                    </li>
                  ))
                )}
              </ul>
            )}
          </section>
        </CardContent>
      </Card>
    </div>

    <style jsx global>{`
      @keyframes slide-in-right {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
      }
      .animate-slide-in-right {
        animation: slide-in-right 0.3s cubic-bezier(0.4,0,0.2,1);
      }
    `}</style>
  </div>
)
}