
import React from 'react';
import { X, Music, Heart, Activity, Brain, Utensils, Archive, MessageCircle, BookOpen } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SelfCarePortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SelfCarePortal = ({ isOpen, onClose }: SelfCarePortalProps) => {
  if (!isOpen) return null;

  const selfCareTiles = [
    {
      title: "Relaxation Music",
      icon: Music,
      description: "Soothing music and soundscapes",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Mindful Movement & Exercise",
      icon: Activity,
      description: "Gentle exercises and stretches",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Burnout Assessment",
      icon: Heart,
      description: "Check your wellbeing levels",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    },
    {
      title: "Mindfulness Games",
      icon: Brain,
      description: "Interactive calming activities",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Meal/Drink Planning",
      icon: Utensils,
      description: "Nutritious meal suggestions",
      color: "bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
    },
    {
      title: "Time Capsules",
      icon: Archive,
      description: "Preserve positive memories",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200"
    },
    {
      title: "Greeting Message Generator",
      icon: MessageCircle,
      description: "Uplifting daily messages",
      color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200"
    },
    {
      title: "Scrambled Journaling",
      icon: BookOpen,
      description: "Creative writing exercises",
      color: "bg-indigo-50 hover:bg-indigo-100 border-indigo-200"
    }
  ];

  return (
    <div className="fixed inset-0 z-50">
      {/* Green transparent overlay */}
      <div className="absolute inset-0 bg-green-500/50" onClick={onClose} />
      
      {/* Portal content - 85% of right side */}
      <div className="absolute top-0 right-0 h-full w-[85%] bg-white shadow-2xl overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/59e03bbf-7415-4289-ac29-413d19f0a2ee.png" 
                alt="Self-Care"
                className="w-12 h-12"
              />
              <div>
                <h2 className="text-2xl font-bold text-green-700">Self-Care Portal</h2>
                <p className="text-green-600">Take a moment for yourself</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-green-100"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {selfCareTiles.map((tile, index) => (
              <Card 
                key={index} 
                className={`cursor-pointer transition-all duration-200 ${tile.color} border-2`}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-center mb-2">
                    <tile.icon className="h-8 w-8 text-gray-600" />
                  </div>
                  <CardTitle className="text-center text-sm font-medium">
                    {tile.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-gray-600 text-center">
                    {tile.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelfCarePortal;
