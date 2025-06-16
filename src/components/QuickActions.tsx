
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Wind, BookOpen, Sparkles, Coffee, Moon } from "lucide-react";

interface QuickActionsProps {
  isLateNight: boolean;
  onEmotionCheckIn: () => void;
  onBreathing: () => void;
  onJournal: () => void;
  onDashboard: () => void;
  onAnalytics: () => void;
}

const QuickActions = ({ 
  isLateNight, 
  onEmotionCheckIn, 
  onBreathing, 
  onJournal,
  onDashboard,
  onAnalytics 
}: QuickActionsProps) => {
  const quickHelpers = [
    {
      title: "5-Minute Breathing",
      subtitle: "Calm your nervous system",
      icon: Wind,
      action: onBreathing,
      color: "text-blue-500"
    },
    {
      title: "Emotion Check-in",
      subtitle: "What are you feeling?",
      icon: Heart,
      action: onEmotionCheckIn,
      color: "text-pink-500"
    },
    {
      title: "Journal",
      subtitle: "Process your thoughts",
      icon: BookOpen,
      action: onJournal,
      color: "text-purple-500"
    },
    {
      title: "Your Insights",
      subtitle: "See your progress",
      icon: Sparkles,
      action: onDashboard,
      color: "text-yellow-500"
    }
  ];

  const affirmations = [
    "You are exactly where you need to be right now.",
    "Every craving is temporary. You are permanent.",
    "You're not broken - you're healing.",
    "Your feelings are valid, and you can handle them.",
    "This moment is just a moment. It will pass.",
    "You've overcome difficult moments before. You can do it again."
  ];

  const todaysAffirmation = affirmations[new Date().getDay() % affirmations.length];

  return (
    <div className="space-y-6">
      {/* Daily Affirmation */}
      <Card className={`p-6 text-center ${
        isLateNight 
          ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-sm border-purple-400/30 text-white' 
          : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          {isLateNight ? <Moon className="w-5 h-5 text-purple-300" /> : <Coffee className="w-5 h-5 text-purple-600" />}
          <h3 className="font-semibold">
            {isLateNight ? "Gentle Reminder" : "Daily Affirmation"}
          </h3>
        </div>
        <p className={`${isLateNight ? 'text-purple-100' : 'text-purple-700'} italic`}>
          "{todaysAffirmation}"
        </p>
      </Card>

      {/* Quick Helper Tools */}
      <div className="grid grid-cols-1 gap-4">
        {quickHelpers.map((helper, index) => (
          <Button
            key={index}
            onClick={helper.action}
            variant="outline"
            className={`h-16 text-left flex items-center gap-4 justify-start ${
              isLateNight
                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'
            }`}
          >
            <helper.icon className={`w-6 h-6 ${helper.color}`} />
            <div>
              <div className="font-semibold">{helper.title}</div>
              <div className="text-sm opacity-70">{helper.subtitle}</div>
            </div>
          </Button>
        ))}
        
        <Button
          onClick={onAnalytics}
          variant="outline"
          className={`h-16 text-left flex items-center gap-4 justify-start ${
            isLateNight
              ? 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              : 'bg-white/80 border-gray-200 text-gray-800 hover:bg-white'
          }`}
        >
          <Sparkles className="w-6 h-6 text-green-500" />
          <div>
            <div className="font-semibold">Mood Analytics</div>
            <div className="text-sm opacity-70">Understand your patterns</div>
          </div>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
