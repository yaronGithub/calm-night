
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmotionCheckInProps {
  onClose: () => void;
  isLateNight: boolean;
}

const EmotionCheckIn = ({ onClose, isLateNight }: EmotionCheckInProps) => {
  const [selectedEmotion, setSelectedEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const emotions = [
    { emoji: '😰', label: 'Anxious', color: 'bg-orange-100 text-orange-800' },
    { emoji: '😢', label: 'Sad', color: 'bg-blue-100 text-blue-800' },
    { emoji: '😤', label: 'Stressed', color: 'bg-red-100 text-red-800' },
    { emoji: '😴', label: 'Bored', color: 'bg-gray-100 text-gray-800' },
    { emoji: '😞', label: 'Lonely', color: 'bg-purple-100 text-purple-800' },
    { emoji: '😊', label: 'Content', color: 'bg-green-100 text-green-800' },
  ];

  const handleSave = () => {
    // Save to local storage or database
    const entry = {
      emotion: selectedEmotion,
      intensity,
      notes,
      timestamp: new Date().toISOString(),
    };
    
    const existingEntries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
    existingEntries.push(entry);
    localStorage.setItem('emotionEntries', JSON.stringify(existingEntries));
    
    toast({
      title: "Emotion logged",
      description: "Thank you for checking in with yourself. This awareness is healing.",
    });
    
    onClose();
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
            <h2 className="text-lg font-semibold">How are you feeling?</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <p className={`${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
              What emotion is present right now?
            </p>
            
            <div className="grid grid-cols-2 gap-3">
              {emotions.map((emotion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => {
                    setSelectedEmotion(emotion.label);
                    setStep(2);
                  }}
                  className={`h-16 flex-col gap-2 ${
                    isLateNight
                      ? 'border-gray-600 text-white hover:bg-gray-800'
                      : 'border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-2xl">{emotion.emoji}</span>
                  <span className="text-sm">{emotion.label}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <p className={`mb-4 ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
                How intense is this feeling?
              </p>
              <div className="space-y-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm">
                  <span className={isLateNight ? 'text-gray-400' : 'text-gray-500'}>Mild</span>
                  <span className="font-semibold text-lg">{intensity}/10</span>
                  <span className={isLateNight ? 'text-gray-400' : 'text-gray-500'}>Intense</span>
                </div>
              </div>
            </div>

            <div>
              <p className={`mb-2 ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
                Anything else you'd like to note? (optional)
              </p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What triggered this feeling? What do you need right now?"
                className={`min-h-[80px] ${
                  isLateNight
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setStep(1)}
                className={isLateNight ? 'border-gray-600 text-white hover:bg-gray-800' : ''}
              >
                Back
              </Button>
              <Button 
                onClick={handleSave}
                className="flex-1 bg-purple-600 hover:bg-purple-700"
              >
                Save Check-in
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default EmotionCheckIn;
