
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Heart, Moon, Star, ArrowLeft } from "lucide-react";
import EmotionCheckIn from '../components/EmotionCheckIn';
import CrisisSupport from '../components/CrisisSupport';
import ProgressTracker from '../components/ProgressTracker';
import JournalEntry from '../components/JournalEntry';
import Dashboard from '../components/Dashboard';
import BreathingExercise from '../components/BreathingExercise';
import MoodAnalytics from '../components/MoodAnalytics';
import QuickActions from '../components/QuickActions';
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLateNight, setIsLateNight] = useState(false);
  const [showCrisisSupport, setShowCrisisSupport] = useState(false);
  const [showEmotionCheckIn, setShowEmotionCheckIn] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'progress' | 'analytics'>('home');
  const [streak, setStreak] = useState(3);
  const { toast } = useToast();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      const hour = now.getHours();
      setIsLateNight(hour >= 20 || hour <= 6);
    }, 60000);

    // Calculate actual streak from stored data
    const emot

ionEntries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
    const calculatedStreak = calculateStreak(emotionEntries);
    setStreak(calculatedStreak);

    return () => clearInterval(timer);
  }, []);

  const calculateStreak = (entries: any[]) => {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = entries.some((entry: any) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }
    
    return streak;
  };

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

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard isLateNight={isLateNight} />;
      case 'progress':
        return <ProgressTracker isLateNight={isLateNight} />;
      case 'analytics':
        return <MoodAnalytics isLateNight={isLateNight} />;
      default:
        return (
          <QuickActions
            isLateNight={isLateNight}
            onEmotionCheckIn={() => setShowEmotionCheckIn(true)}
            onBreathing={() => setShowBreathing(true)}
            onJournal={() => setShowJournal(true)}
            onDashboard={() => setCurrentView('dashboard')}
            onAnalytics={() => setCurrentView('analytics')}
          />
        );
    }
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
          <div className="flex items-center justify-between mb-4">
            {currentView !== 'home' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentView('home')}
                className={isLateNight ? 'text-white hover:bg-white/20' : ''}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <div className={`flex items-center gap-2 ${currentView !== 'home' ? 'flex-1 justify-center' : 'justify-center w-full'}`}>
              {isLateNight ? <Moon className="w-6 h-6" /> : <Heart className="w-6 h-6 text-pink-500" />}
              <h1 className={`text-2xl font-bold ${isLateNight ? 'text-white' : 'text-gray-800'}`}>
                Nourish
              </h1>
            </div>

            {currentView !== 'home' && <div className="w-8" />}
          </div>
          
          {currentView === 'home' && (
            <>
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
            </>
          )}
        </div>

        {/* Emergency Support Button - Always visible on home */}
        {currentView === 'home' && (
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
        )}

        {/* Progress Streak - Always visible on home */}
        {currentView === 'home' && (
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
            <Progress value={Math.min((streak / 7) * 100, 100)} className="mb-2" />
            <p className={`text-sm ${
              isLateNight ? 'text-purple-200' : 'text-gray-600'
            }`}>
              {streak} {streak === 1 ? 'day' : 'days'} of emotional awareness
            </p>
          </Card>
        )}

        {/* Navigation Pills - Only on home */}
        {currentView === 'home' && (
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('dashboard')}
              className={isLateNight ? 'border-white/20 text-white hover:bg-white/20' : ''}
            >
              Insights
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('progress')}
              className={isLateNight ? 'border-white/20 text-white hover:bg-white/20' : ''}
            >
              Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentView('analytics')}
              className={isLateNight ? 'border-white/20 text-white hover:bg-white/20' : ''}
            >
              Analytics
            </Button>
          </div>
        )}

        {/* Main Content */}
        {renderCurrentView()}

        {/* Gentle Reminder - Only on home and late night */}
        {currentView === 'home' && isLateNight && (
          <Card className="mt-6 p-4 bg-gradient-to-r from-purple-800/30 to-indigo-800/30 backdrop-blur-sm border-purple-400/30">
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

      {showBreathing && (
        <BreathingExercise onClose={() => setShowBreathing(false)} isLateNight={isLateNight} />
      )}
    </div>
  );
};

export default Index;
