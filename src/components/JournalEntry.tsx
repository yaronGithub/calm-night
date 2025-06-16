
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { X, MessageCircle, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntryProps {
  onClose: () => void;
  isLateNight: boolean;
}

const JournalEntry = ({ onClose, isLateNight }: JournalEntryProps) => {
  const [entry, setEntry] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  const prompts = [
    "What emotions came up for you today?",
    "What triggered any urges to eat emotionally?",
    "What small victory can you celebrate?",
    "What do you need more of in your life?",
    "How can you be gentler with yourself tomorrow?",
  ];

  const handleSave = () => {
    const journalEntry = {
      entry,
      gratitude,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
    };
    
    const existingJournals = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    existingJournals.push(journalEntry);
    localStorage.setItem('journalEntries', JSON.stringify(existingJournals));
    
    toast({
      title: "Journal saved",
      description: "Your thoughts and feelings matter. Thank you for sharing them.",
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className={`w-full max-w-md max-h-[80vh] overflow-y-auto p-6 ${
        isLateNight 
          ? 'bg-gray-900/95 border-gray-700 text-white' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold">Journal</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <p className={`mb-4 ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
                Let's reflect on your day. Choose a prompt or write freely:
              </p>
              
              <div className="space-y-2 mb-4">
                {prompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    onClick={() => setEntry(prompt + '\n\n')}
                    className={`w-full text-left text-sm h-auto p-3 ${
                      isLateNight
                        ? 'text-gray-300 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    "{prompt}"
                  </Button>
                ))}
              </div>

              <Textarea
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                placeholder="Write your thoughts here... There's no wrong way to do this."
                className={`min-h-[120px] ${
                  isLateNight
                    ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                    : 'bg-white border-gray-300'
                }`}
              />
            </div>

            <Button 
              onClick={() => setStep(2)}
              disabled={!entry.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Continue
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-4 h-4 text-pink-500" />
                <p className={`${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
                  What's one thing you're grateful for today?
                </p>
              </div>
              
              <Textarea
                value={gratitude}
                onChange={(e) => setGratitude(e.target.value)}
                placeholder="Even the smallest thing counts..."
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
                Save Journal
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default JournalEntry;
