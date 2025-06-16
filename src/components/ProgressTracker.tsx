
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, Calendar, Heart, TrendingUp } from "lucide-react";

interface ProgressTrackerProps {
  isLateNight: boolean;
}

const ProgressTracker = ({ isLateNight }: ProgressTrackerProps) => {
  // Mock data - in real app, this would come from user's actual progress
  const weeklyProgress = [
    { day: 'Mon', successful: true },
    { day: 'Tue', successful: true },
    { day: 'Wed', successful: false },
    { day: 'Thu', successful: true },
    { day: 'Fri', successful: true },
    { day: 'Sat', successful: true },
    { day: 'Sun', successful: false },
  ];

  const emotionalWins = [
    "Recognized anxiety before eating",
    "Chose tea over snacks",
    "Used breathing exercise",
    "Journaled instead of snacking",
  ];

  const successRate = Math.round((weeklyProgress.filter(day => day.successful).length / weeklyProgress.length) * 100);

  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card className={`p-6 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">This Week</h3>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          {weeklyProgress.map((day, index) => (
            <div key={index} className="text-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                day.successful 
                  ? 'bg-green-500 text-white' 
                  : isLateNight 
                    ? 'bg-gray-700 text-gray-400'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {day.successful ? <Star className="w-4 h-4" /> : ''}
              </div>
              <span className={`text-xs ${
                isLateNight ? 'text-gray-300' : 'text-gray-600'
              }`}>
                {day.day}
              </span>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Success Rate</span>
            <span className="text-sm font-semibold">{successRate}%</span>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>
      </Card>

      {/* Emotional Wins */}
      <Card className={`p-6 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-5 h-5 text-pink-500" />
          <h3 className="font-semibold">Recent Emotional Wins</h3>
        </div>
        
        <div className="space-y-3">
          {emotionalWins.map((win, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className={`text-sm ${
                isLateNight ? 'text-gray-200' : 'text-gray-600'
              }`}>
                {win}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Growth Insights */}
      <Card className={`p-6 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold">Growth Insight</h3>
        </div>
        
        <p className={`text-sm ${
          isLateNight ? 'text-gray-200' : 'text-gray-600'
        }`}>
          You're most successful when you journal before 9 PM. Consider setting a gentle reminder for tomorrow.
        </p>
      </Card>
    </div>
  );
};

export default ProgressTracker;
