
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Moon, Calendar, MessageCircle, Star } from "lucide-react";
import EmotionCheckIn from '../components/EmotionCheckIn';
import CrisisSupport from '../components/CrisisSupport';
import ProgressTracker from '../components/ProgressTracker';
import JournalEntry from '../components/JournalEntry';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLateNight, setIsLateNight] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [showEmotionCheckIn, setShowEmotionCheckIn] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [streak, setStreak] = useState(3);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      setIsLateNight(hour >= 20 || hour <= 6);
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleEmergencyHelp = () => {
    setShowCrisisSupport(true);
    toast({
      title: "You're not alone",
      description: "Take a deep breath. Let's work through this together.",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "You're up late";
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 ${
      isLateNight 
        ? 'bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center gap-2 mb-4 ${
            isLateNight ? 'text-white' : 'text-gray-800'
          }`}>
            {isLateNight ? <Moon className="w-6 h-6" /> : <Heart className="w-6 h-6 text-pink-500" />}
            <h1 className="text-2xl font-bold">Nourish</h1>
          </div>
          <p className={`text-lg font-medium ${
            isLateNight ? 'text-purple-200' : 'text-gray-600'
          }`}>
            {getGreeting()}
          </p>
          <p className={`text-sm ${
            isLateNight ? 'text-purple-300' : 'text-gray-500'
          }`}>
            {formatTime(currentTime)} • You've got this
          </p>
        </div>

        {/* Emergency Support Button */}
        <Card className={`mb-6 p-4 border-2 ${
          isLateNight 
            ? 'bg-red-900/20 border-red-400/30 backdrop-blur-sm' 
            : 'bg-red-50 border-red-200'
        }`}>
          <Button 
            onClick={handleEmergencyHelp}
            className={`w-full h-12 text-lg font-semibold ${
              isLateNight
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-red-500 hover:bg-red-600 text-white'
            }`}
          >
            I Need Support Right Now
          </Button>
        </Card>

        {/* Progress Streak */}
        <Card className={`mb-6 p-6 ${
          isLateNight 
            ? 'bg-white/10 backdrop-blur-sm border-white/20' 
            : 'bg-white/80 backdrop-blur-sm border-white/40'
        }`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Star className={`w-5 h-5 ${isLateNight ? 'text-yellow-400' : 'text-yellow-500'}`} />
              <span className={`font-semibold ${
                isLateNight ? 'text-white' : 'text-gray-800'
              }`}>
                Healing Streak
              </span>
            </div>
            <span className={`text-2xl font-bold ${
              isLateNight ? 'text-purple-200' : 'text-purple-600'
            }`}>
              {streak}
            </span>
          </div>
          <Progress value={(streak / 7) * 100} className="mb-2" />
          <p className={`text-sm ${
            isLateNight ? 'text-purple-200' : 'text-gray-600'
          }`}>
            {streak} nights of choosing calm over cravings
          </p>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-4 mb-6">
          <Button
            onClick={() => setShowEmotionCheckIn(true)}
            variant="outline"
            className={`h-16 text-left flex items-center gap-4 ${
              isLateNight
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'
            }`}
          >
            <Heart className="w-6 h-6 text-pink-500" />
            <div>
              <div className="font-semibold">How are you feeling?</div>
              <div className="text-sm opacity-70">Quick emotion check-in</div>
            </div>
          </Button>

          <Button
            onClick={() => setShowJournal(true)}
            variant="outline"
            className={`h-16 text-left flex items-center gap-4 ${
              isLateNight
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'
            }`}
          >
            <MessageCircle className="w-6 h-6 text-blue-500" />
            <div>
              <div className="font-semibold">Journal</div>
              <div className="text-sm opacity-70">Reflect on your day</div>
            </div>
          </Button>
        </div>

        {/* Gentle Reminder */}
        {isLateNight && (
          <Card className="p-4 bg-gradient-to-r from-purple-800/30 to-indigo-800/30 backdrop-blur-sm border-purple-400/30">
            <p className="text-purple-100 text-center text-sm">
              "You are not broken. You are healing. Every moment of awareness is progress."
            </p>
          </Card>
        )}
      </div>

      {/* Modals */}
      {showCrisisSupport && (
        <CrisisSupport onClose={() => setShowCrisisSupport(false)} isLateNight={isLateNight} />
      )}
      
      {showEmotionCheckIn && (
        <EmotionCheckIn onClose={() => setShowEmotionCheckIn(false)} isLateNight={isLateNight} />
      )}
      
      {showJournal && (
        <JournalEntry onClose={() => setShowJournal(false)} isLateNight={isLateNight} />
      )}
    </div>
  );
};

export default Index;
