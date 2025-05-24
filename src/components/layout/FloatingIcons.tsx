
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import SelfCarePortal from './SelfCarePortal';
import EmergencyPortal from './EmergencyPortal';

const FloatingIcons = () => {
  const [showSelfCare, setShowSelfCare] = useState(false);
  const [showEmergency, setShowEmergency] = useState(false);

  return (
    <>
      <div className="fixed bottom-4 left-48 flex gap-3 z-50">
        <Button
          onClick={() => setShowSelfCare(true)}
          className="w-8 h-8 rounded-full p-0 bg-green-500 hover:bg-green-600 border border-white shadow-md"
          title="Self-Care Portal"
        >
          <img 
            src="/lovable-uploads/59e03bbf-7415-4289-ac29-413d19f0a2ee.png" 
            alt="Self-Care"
            className="w-6 h-6 object-contain"
          />
        </Button>
        
        <Button
          onClick={() => setShowEmergency(true)}
          className="w-8 h-8 rounded-full p-0 bg-red-500 hover:bg-red-600 border border-white shadow-md"
          title="Emergency & Crisis Support"
        >
          <img 
            src="/lovable-uploads/52a1d7b8-5f43-4ba1-a9f6-5f526d58134d.png" 
            alt="Emergency Support"
            className="w-6 h-6 object-contain"
          />
        </Button>
      </div>

      <SelfCarePortal 
        isOpen={showSelfCare} 
        onClose={() => setShowSelfCare(false)} 
      />
      
      <EmergencyPortal 
        isOpen={showEmergency} 
        onClose={() => setShowEmergency(false)} 
      />
    </>
  );
};

export default FloatingIcons;
