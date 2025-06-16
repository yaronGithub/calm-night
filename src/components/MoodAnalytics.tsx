
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, BarChart3, Calendar } from "lucide-react";
import { useState, useEffect } from "react";

interface MoodAnalyticsProps {
  isLateNight: boolean;
}

const MoodAnalytics = ({ isLateNight }: MoodAnalyticsProps) => {
  const [moodData, setMoodData] = useState<any[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<any[]>([]);

  useEffect(() => {
    const emotionEntries = JSON.parse(localStorage.getItem('emotionEntries') || '[]');
    
    // Process mood trend data (last 7 days)
    const last7Days = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayEntries = emotionEntries.filter((entry: any) => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toDateString() === date.toDateString();
      });
      
      const avgMood = dayEntries.length > 0 
        ? dayEntries.reduce((sum: number, entry: any) => sum + (11 - entry.intensity), 0) / dayEntries.length
        : null;
      
      last7Days.push({
        day: date.toLocaleDateString('en', { weekday: 'short' }),
        mood: avgMood ? Math.round(avgMood * 10) / 10 : null,
        entries: dayEntries.length
      });
    }
    setMoodData(last7Days);

    // Process emotion distribution
    const emotionCounts: { [key: string]: number } = {};
    emotionEntries.forEach((entry: any) => {
      emotionCounts[entry.emotion] = (emotionCounts[entry.emotion] || 0) + 1;
    });

    const colors = ['#8B5CF6', '#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#F97316'];
    const distribution = Object.entries(emotionCounts).map(([emotion, count], index) => ({
      name: emotion,
      value: count,
      color: colors[index % colors.length]
    }));
    
    setEmotionDistribution(distribution);
  }, []);

  return (
    <div className="space-y-6">
      {/* Mood Trend Chart */}
      <Card className={`p-6 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">7-Day Mood Trend</h3>
        </div>
        
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={moodData}>
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fill: isLateNight ? '#D1D5DB' : '#6B7280', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 10]}
                axisLine={false}
                tickLine={false}
                tick={{ fill: isLateNight ? '#D1D5DB' : '#6B7280', fontSize: 12 }}
              />
              <Line 
                type="monotone" 
                dataKey="mood" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <p className={`text-sm mt-2 ${isLateNight ? 'text-gray-300' : 'text-gray-600'}`}>
          Higher values indicate better emotional balance
        </p>
      </Card>

      {/* Emotion Distribution */}
      {emotionDistribution.length > 0 && (
        <Card className={`p-6 ${
          isLateNight 
            ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
            : 'bg-white/80 backdrop-blur-sm border-white/40'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold">Emotion Patterns</h3>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="h-32 w-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={20}
                    outerRadius={60}
                    dataKey="value"
                  >
                    {emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex-1 ml-4">
              {emotionDistribution.map((emotion, index) => (
                <div key={index} className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: emotion.color }}
                    />
                    <span className="text-sm">{emotion.name}</span>
                  </div>
                  <span className={`text-sm font-medium ${isLateNight ? 'text-gray-300' : 'text-gray-600'}`}>
                    {emotion.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Weekly Summary */}
      <Card className={`p-4 ${
        isLateNight 
          ? 'bg-white/10 backdrop-blur-sm border-white/20 text-white' 
          : 'bg-white/80 backdrop-blur-sm border-white/40'
      }`}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-green-500" />
          <h4 className="font-medium">This Week's Insight</h4>
        </div>
        <p className={`text-sm ${isLateNight ? 'text-gray-200' : 'text-gray-600'}`}>
          You're building emotional awareness through consistent check-ins. Each entry helps you understand your patterns and grow.
        </p>
      </Card>
    </div>
  );
};

export default MoodAnalytics;
