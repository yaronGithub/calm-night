
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { X, Play, Pause, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BreathingExerciseProps {
  onClose: () => void;
  isLateNight: boolean;
}

const BreathingExercise = ({ onClose, isLateNight }: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [cycle, setCycle] = useState(0);
  const [technique, setTechnique] = useState('4-4-6');
  const { toast } = useToast();

  const techniques = {
    '4-4-6': { inhale: 4, hold: 4, exhale: 6, name: 'Calming Breath' },
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, name: 'Sleep Breath' },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, name: 'Balanced Breath' }
  };

  const currentTechnique = techniques[technique as keyof typeof techniques];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      // Move to next phase
      if (phase === 'inhale') {
        setPhase('hold');
        setTimeLeft(currentTechnique.hold);
      } else if (phase === 'hold') {
        setPhase('exhale');
        setTimeLeft(currentTechnique.exhale);
      } else {
        setPhase('inhale');
        setTimeLeft(currentTechnique.inhale);
        setCycle(prev => prev + 1);
        
        if (cycle >= 5) {
          setIsActive(false);
          toast({
            title: "Beautiful work",
            description: "You've completed a full breathing session. Notice how you feel now.",
          });
        }
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, phase, currentTechnique, cycle, toast]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setTimeLeft(currentTechnique.inhale);
    setCycle(0);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resetExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setTimeLeft(currentTechnique.inhale);
    setCycle(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in slowly...';
      case 'hold':
        return 'Hold gently...';
      case 'exhale':
        return 'Release and let go...';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-blue-600';
      case 'hold':
        return 'from-purple-400 to-purple-600';
      case 'exhale':
        return 'from-green-400 to-green-600';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <Card className={`w-full max-w-md p-8 text-center ${
        isLateNight 
          ? 'bg-gray-900/95 border-gray-700 text-white' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Breathing Space</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Technique Selector */}
        <div className="mb-6">
          <p className={`text-sm mb-3 ${isLateNight ? 'text-gray-300' : 'text-gray-600'}`}>
            Choose your technique:
          </p>
          <div className="grid grid-cols-1 gap-2">
            {Object.entries(techniques).map(([key, tech]) => (
              <Button
                key={key}
                variant={technique === key ? "default" : "outline"}
                size="sm"
                onClick={() => setTechnique(key)}
                disabled={isActive}
                className={technique === key ? '' : (isLateNight ? 'border-gray-600 text-white hover:bg-gray-800' : '')}
              >
                {tech.name} ({key})
              </Button>
            ))}
          </div>
        </div>

        {/* Breathing Circle */}
        <div className="relative mb-8">
          <div className={`w-32 h-32 mx-auto rounded-full bg-gradient-to-br ${getPhaseColor()} 
            flex items-center justify-center transition-all duration-1000 ${
            isActive ? (phase === 'inhale' ? 'scale-110' : phase === 'exhale' ? 'scale-90' : 'scale-100') : 'scale-100'
          }`}>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{timeLeft}</div>
              <div className="text-sm text-white/80 capitalize">{phase}</div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <p className={`text-lg mb-2 ${isLateNight ? 'text-gray-200' : 'text-gray-700'}`}>
          {getPhaseInstruction()}
        </p>
        
        <p className={`text-sm mb-6 ${isLateNight ? 'text-gray-400' : 'text-gray-500'}`}>
          Cycle {cycle + 1} of 6
        </p>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={startExercise} className="bg-blue-600 hover:bg-blue-700">
              <Play className="w-4 h-4 mr-2" />
              Start
            </Button>
          ) : (
            <Button onClick={pauseExercise} variant="outline" className={isLateNight ? 'border-gray-600 text-white hover:bg-gray-800' : ''}>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </Button>
          )}
          
          <Button onClick={resetExercise} variant="outline" className={isLateNight ? 'border-gray-600 text-white hover:bg-gray-800' : ''}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BreathingExercise;
