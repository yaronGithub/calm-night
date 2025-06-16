
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Heart, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CrisisSupportProps {
  onClose: () => void;
  isLateNight: boolean;
}

const CrisisSupport = ({ onClose, isLateNight }: CrisisSupportProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const { toast } = useToast();

  const steps = [
    {
      title: "Take a moment",
      content: "You reached out, and that takes courage. Let's pause together.",
      action: "I'm ready"
    },
    {
      title: "What are you really feeling?",
      content: "Beneath the urge to eat, what emotion is calling for attention?",
      options: ["Anxious", "Lonely", "Stressed", "Bored", "Sad", "Overwhelmed"]
    },
    {
      title: "Let's breathe together",
      content: "Follow the rhythm. Breathe in for 4, hold for 4, out for 6.",
      action: "Start breathing"
    },
    {
      title: "You did it",
      content: "Notice how you feel now. This moment of awareness is healing.",
      action: "I feel better"
    }
  ];

  const startBreathing = () => {
    setIsBreathing(true);
    let count = 0;
    const interval = setInterval(() => {
      count++;
      setBreathCount(count);
      if (count >= 6) {
        clearInterval(interval);
        setIsBreathing(false);
        setCurrentStep(3);
        toast({
          title: "Beautiful",
          description: "You just chose healing over habit. That's powerful.",
        });
      }
    }, 2000);
  };

  const handleEmotionSelect = (emotion: string) => {
    setCurrentStep(2);
    toast({
      title: `Feeling ${emotion.toLowerCase()} is valid`,
      description: "Let's work through this together.",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className={`w-full max-w-md p-6 ${
        isLateNight 
          ? 'bg-gray-900/95 border-gray-700 text-white' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            <h2 className="text-lg font-semibold">You're Safe Here</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">
            {steps[currentStep].title}
          </h3>
          
          <p className={`mb-6 ${
            isLateNight ? 'text-gray-200' : 'text-gray-600'
          }`}>
            {steps[currentStep].content}
          </p>

          {currentStep === 0 && (
            <Button 
              onClick={() => setCurrentStep(1)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {steps[currentStep].action}
            </Button>
          )}

          {currentStep === 1 && (
            <div className="grid grid-cols-2 gap-3">
              {steps[currentStep].options?.map((emotion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleEmotionSelect(emotion)}
                  className={`h-12 ${
                    isLateNight
                      ? 'border-gray-600 text-white hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {emotion}
                </Button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              {!isBreathing ? (
                <Button 
                  onClick={startBreathing}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {steps[currentStep].action}
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className={`w-24 h-24 mx-auto rounded-full border-4 flex items-center justify-center ${
                    breathCount % 2 === 1 
                      ? 'border-blue-400 bg-blue-100 scale-110' 
                      : 'border-blue-600 bg-blue-50 scale-100'
                  } transition-all duration-2000`}>
                    <Clock className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-lg font-medium">
                    {breathCount % 2 === 1 ? 'Breathe in...' : 'Breathe out...'}
                  </p>
                  <p className="text-sm opacity-70">
                    {breathCount}/6 breaths
                  </p>
                </div>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <Button 
                onClick={onClose}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {steps[currentStep].action}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CrisisSupport;
