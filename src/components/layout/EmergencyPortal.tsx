
import React from 'react';
import { X, Phone, AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface EmergencyPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EmergencyPortal = ({ isOpen, onClose }: EmergencyPortalProps) => {
  if (!isOpen) return null;

  const crisisLines = [
    {
      name: "Veterans and Veterans Families Counselling Service",
      number: "1800 011 046",
      description: "In support of veterans and their families exposed to military mental health."
    },
    {
      name: "Lifeline",
      number: "13 11 14",
      website: "www.lifeline.org.au",
      description: "A crisis support and suicide prevention service for all Australians."
    },
    {
      name: "Suicide Call Back Service",
      number: "1300 659 467",
      website: "www.suicidecallbackservice.org.au",
      description: "A free service for people who are suicidal, caring for someone who is suicidal, bereaved by suicide or are health professionals supporting people affected by suicide."
    },
    {
      name: "Kids Helpline",
      number: "1800 55 1800",
      website: "www.kidshelpline.com.au",
      description: "A counselling service specifically for young people aged between 5 and 25."
    },
    {
      name: "FullStop Australia",
      number: "1800 385 578",
      description: "Offers free, 24/7, confidential, trauma specialist counselling to people of all genders who have been subject to sexual, domestic and family violence, as well as their friends, colleagues and family members."
    }
  ];

  const stateCrisisNumbers = [
    { state: "NSW", service: "Mental Health Line", number: "1800 011 511" },
    { state: "VIC", service: "Suicide Help Line", number: "1300 651 251" },
    { state: "QLD", service: "13 HEALTH", number: "13 43 25 84" },
    { state: "SA", service: "Mental Health Assessment and Crisis Intervention Service", number: "13 14 65" },
    { state: "WA", service: "Mental Health Emergency Response Line", number: "1800 676 822 (PEEL) / 1300 555 788 (Metro)" },
    { state: "TAS", service: "Mental Health Services Helpline", number: "1800 332 388" },
    { state: "NT", service: "Mental Health Line", number: "1800 682 288" },
    { state: "ACT", service: "Mental Health Triage Service", number: "1800 629 354" }
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Red transparent overlay */}
      <div className="absolute inset-0 bg-red-500/50" onClick={onClose} />
      
      {/* Portal content - 85% of right side */}
      <div className="absolute top-0 right-0 h-full w-[85%] bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/52a1d7b8-5f43-4ba1-a9f6-5f526d58134d.png" 
                alt="Emergency Support"
                className="w-12 h-12"
              />
              <div>
                <h2 className="text-2xl font-bold text-red-700">Emergency & Crisis Support</h2>
                <p className="text-red-600">Immediate help and support resources</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-red-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Emergency Assistance */}
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" />
                Emergency Assistance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-red-100 rounded-lg">
                <Phone className="h-8 w-8 text-red-600" />
                <div>
                  <p className="font-semibold text-red-800">If you need emergency assistance, please phone</p>
                  <p className="text-2xl font-bold text-red-700">000</p>
                  <p className="text-red-600">for police, ambulance or fire services NOW.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Crisis Support Lines */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-gray-700">Crisis Support Lines</CardTitle>
              <p className="text-sm text-gray-600">
                24 hours a day, 7 days a week telephone crisis support and counselling
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {crisisLines.map((line, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-gray-800">{line.name}</h4>
                  <p className="text-lg font-mono text-blue-600 my-1">{line.number}</p>
                  {line.website && (
                    <p className="text-sm text-blue-500">{line.website}</p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">{line.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* State Crisis Numbers */}
          <Card>
            <CardHeader>
              <CardTitle className="text-gray-700">State Crisis Numbers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {stateCrisisNumbers.map((state, index) => (
                  <div key={index} className="flex justify-between items-center p-3 border rounded">
                    <div>
                      <span className="font-semibold text-gray-800">{state.state}</span>
                      <span className="text-gray-600 ml-2">{state.service}</span>
                    </div>
                    <span className="font-mono text-blue-600">{state.number}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPortal;
