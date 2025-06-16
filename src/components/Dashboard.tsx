
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Brain, Heart, Calendar, Target, Zap } from "lucide-react";
import { useState, useEffect } from "react";

interface DashboardProps {
  isLateNight: boolean;
}

const Dashboard = ({ isLateNight }: DashboardProps) => {
  const [insights, setInsights] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    totalCheckIns: 0,
    avgMood: 0,
    streakDays: 0,
    improvedDays: 0
  });

  useEffect(() => {
    // Load user data from localStorage
    const emotionEntries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
    const journalEntries = JSON.parse(localStorage.getItem('journalEntries') || '[]');
    
    // Calculate insights
    const recentEntries = emotionEntries.slice(-14); // Last 2 weeks
    const avgMood = recentEntries.length > 0 
      ? recentEntries.reduce((sum: number, entry: any) => sum + (11 - entry.intensity), 0) / recentEntries.length 
      : 5;
    
    setWeeklyStats({
      totalCheckIns: emotionEntries.length,
      avgMood: Math.round(avgMood * 10) / 10,
      streakDays: calculateStreak(emotionEntries),
      improvedDays: Math.floor(Math.random() * 5) + 3 // Mock for now
    });

    // Generate personalized insights
    const newInsights = generateInsights(emotionEntries, journalEntries);
    setInsights(newInsights);
  }, []);

  const calculateStreak = (entries: any[]) => {
    if (entries.length === 0) return 0;
    
    const today = new Date();
    let streak = 0;
    
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === checkDate.toDateString();
      });
      
      if (hasEntry) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const generateInsights = (emotions: any[], journals: any[]) => {
    const insights = [];
    
    if (emotions.length > 5) {
      const recentEmotions = emotions.slice(-7);
      const commonEmotion = getMostCommonEmotion(recentEmotions);
      insights.push({
        icon: Brain,
        title: "Pattern Recognition",
        content: `You've been feeling ${commonEmotion.toLowerCase()} most often this week. This awareness is the first step to healing.`,
        color: "text-purple-500"
      });
    }

    if (journals.length > 2) {
      insights.push({
        icon: Heart,
        title: "Journal Reflection",
        content: "Your journaling shows incredible self-awareness. Keep nurturing this mindful relationship with your emotions.",
        color: "text-pink-500"
      });
    }

    insights.push({
      icon: Target,
      title: "Your Growth",
      content: "Every check-in is progress. You're building emotional intelligence one moment at a time.",
      color: "text-blue-500"
    });

    return insights;
  };

  const getMostCommonEmotion = (emotions: any[]) => {
    const counts: { [key: string]: number } = {};
    emotions.forEach(entry => {
      counts[entry.emotion] = (counts[entry.emotion] || 0) + 1;
    });
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b) || 'Balanced';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 gap-4">
        <Card className={`p-4 ${
          isLateNight 
            ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
            : 'bg-white/80 backdrop-blur-sm border-white/40'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium">Check-ins</span>
          </div>
          <p className="text-2xl font-bold">{weeklyStats.totalCheckIns}</p>
          <p className={`text-xs ${isLateNight ? 'text-gray-300' : 'text-gray-600'}`}>
            Total sessions
          </p>
        </Card>

        <Card className={`p-4 ${
          isLateNight 
            ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
            : 'bg-white/80 backdrop-blur-sm border-white/40'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Streak</span>
          </div>
          <p className="text-2xl font-bold">{weeklyStats.streakDays}</p>
          <p className={`text-xs ${isLateNight ? 'text-gray-300' : 'text-gray-600'}`}>
            Days in a row
          </p>
        </Card>
      </div>

      {/* Mood Trend */}
      <Card className={`p-6 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold">Emotional Wellness</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Overall Balance</span>
            <span className="text-sm font-semibold">{weeklyStats.avgMood}/10</span>
          </div>
          <Progress value={weeklyStats.avgMood * 10} className="h-3" />
          <p className={`text-sm ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
            You're making meaningful progress in emotional awareness
          </p>
        </div>
      </Card>

      {/* Personalized Insights */}
      <div className="space-y-4">
        <h3 className={`font-semibold ${isLateNight ? 'text-white' : 'text-gray-800'}`}>
          Your Insights
        </h3>
        
        {insights.map((insight, index) => (
          <Card key={index} className={`p-4 ${
            isLateNight 
              ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
              : 'bg-white/80 backdrop-blur-sm border-white/40'
          }`}>
            <div className="flex items-start gap-3">
              <insight.icon className={`w-5 h-5 ${insight.color} mt-0.5`} />
              <div>
                <h4 className="font-medium mb-1">{insight.title}</h4>
                <p className={`text-sm ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
                  {insight.content}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
