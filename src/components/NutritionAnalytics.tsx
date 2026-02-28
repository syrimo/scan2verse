import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Target, Award, Calendar, Clock } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { getNutritionTotals, getTopFoods } from '@/hooks/useFoodData';

interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  serving_size: string;
  category?: string;
  image_url?: string;
  is_packaged?: boolean;
  barcode?: string;
  ingredients?: string;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  cholesterol?: number;
  created_at: string;
}

interface FoodEntry {
  id: string;
  food_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  notes?: string;
  created_at: string;
  food?: Food;
}

interface NutritionAnalyticsProps {
  foodEntries: FoodEntry[];
  userProfile?: {
    calorie_goal?: number;
    protein_goal?: number;
    weight?: number;
    goal?: string;
    activity_level?: string;
  };
}

const COLORS = ['#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const NutritionAnalytics = ({ foodEntries, userProfile }: NutritionAnalyticsProps) => {
  // Calculate analytics data
  const analytics = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const last7Days = Array.from({ length: 7 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    ).reverse();
    const last30Days = Array.from({ length: 30 }, (_, i) => 
      format(subDays(new Date(), i), 'yyyy-MM-dd')
    ).reverse();

    // Today's nutrition
    const todayEntries = foodEntries.filter(entry => entry.date === today);
    const todayNutrition = getNutritionTotals(todayEntries);

    // Weekly trend
    const weeklyData = last7Days.map(date => {
      const dayEntries = foodEntries.filter(entry => entry.date === date);
      const nutrition = getNutritionTotals(dayEntries);
      return {
        date: format(new Date(date), 'MMM dd'),
        calories: Math.round(nutrition.calories),
        protein: Math.round(nutrition.protein),
        carbs: Math.round(nutrition.carbs),
        fat: Math.round(nutrition.fat),
        entries: dayEntries.length,
      };
    });

    // Monthly averages
    const monthlyEntries = foodEntries.filter(entry => 
      last30Days.includes(entry.date)
    );
    const monthlyNutrition = getNutritionTotals(monthlyEntries);
    const avgDaily = {
      calories: Math.round(monthlyNutrition.calories / 30),
      protein: Math.round(monthlyNutrition.protein / 30),
      carbs: Math.round(monthlyNutrition.carbs / 30),
      fat: Math.round(monthlyNutrition.fat / 30),
    };

    // Macro distribution (today)
    const macroData = [
      { name: 'Protein', value: todayNutrition.protein * 4, color: '#10b981' },
      { name: 'Carbs', value: todayNutrition.carbs * 4, color: '#06b6d4' },
      { name: 'Fat', value: todayNutrition.fat * 9, color: '#f59e0b' },
    ];

    // Meal distribution
    const mealData = ['breakfast', 'lunch', 'dinner', 'snack'].map(meal => {
      const mealEntries = todayEntries.filter(entry => entry.meal_type === meal);
      const mealNutrition = getNutritionTotals(mealEntries);
      return {
        name: meal.charAt(0).toUpperCase() + meal.slice(1),
        calories: Math.round(mealNutrition.calories),
        entries: mealEntries.length,
      };
    }).filter(meal => meal.calories > 0);

    // Top foods
    const topFoods = getTopFoods(monthlyEntries, 5);

    // Streaks and achievements
    const consecutiveDays = calculateStreak(foodEntries);
    const totalDaysLogged = new Set(foodEntries.map(entry => entry.date)).size;
    const totalFoodsScanned = new Set(foodEntries.map(entry => entry.food_id)).size;

    return {
      today: todayNutrition,
      weekly: weeklyData,
      monthly: avgDaily,
      macros: macroData,
      meals: mealData,
      topFoods,
      stats: {
        streak: consecutiveDays,
        totalDays: totalDaysLogged,
        totalFoods: totalFoodsScanned,
        totalEntries: foodEntries.length,
      }
    };
  }, [foodEntries]);

  const goals = {
    calories: userProfile?.calorie_goal || 2000,
    protein: userProfile?.protein_goal || 150,
    carbs: Math.round((userProfile?.calorie_goal || 2000) * 0.45 / 4), // 45% of calories
    fat: Math.round((userProfile?.calorie_goal || 2000) * 0.30 / 9), // 30% of calories
  };

  return (
    <div className="space-y-6">
      {/* Today's Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-400">
              {Math.round(analytics.today.calories)}
            </div>
            <div className="text-xs text-muted-foreground/70">
              Goal: {goals.calories} cal
            </div>
            <Progress 
              value={(analytics.today.calories / goals.calories) * 100} 
              className="mt-2 h-2"
            />
            <div className="flex items-center mt-2 text-xs">
              {analytics.today.calories > goals.calories ? (
                <TrendingUp className="w-3 h-3 text-red-400 mr-1" />
              ) : (
                <Target className="w-3 h-3 text-green-400 mr-1" />
              )}
              <span className="text-muted-foreground">
                {Math.round(((analytics.today.calories / goals.calories) * 100))}% of goal
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {Math.round(analytics.today.protein)}g
            </div>
            <div className="text-xs text-muted-foreground/70">
              Goal: {goals.protein}g
            </div>
            <Progress 
              value={(analytics.today.protein / goals.protein) * 100} 
              className="mt-2 h-2"
            />
            <div className="flex items-center mt-2 text-xs">
              {analytics.today.protein > goals.protein ? (
                <TrendingUp className="w-3 h-3 text-green-400 mr-1" />
              ) : (
                <Target className="w-3 h-3 text-orange-400 mr-1" />
              )}
              <span className="text-muted-foreground">
                {Math.round(((analytics.today.protein / goals.protein) * 100))}% of goal
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-cyan-400">
              {analytics.stats.streak}
            </div>
            <div className="text-xs text-muted-foreground/70">
              consecutive days
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Award className="w-3 h-3 text-yellow-400 mr-1" />
              <span className="text-muted-foreground">
                Keep it up!
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Foods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-400">
              {analytics.stats.totalFoods}
            </div>
            <div className="text-xs text-muted-foreground/70">
              unique foods scanned
            </div>
            <div className="flex items-center mt-2 text-xs">
              <Calendar className="w-3 h-3 text-blue-400 mr-1" />
              <span className="text-muted-foreground">
                {analytics.stats.totalDays} days logged
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Trend */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Weekly Nutrition Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="calories" 
                  stroke="#f59e0b" 
                  fill="#f59e0b20"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Macro Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Today's Macro Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.macros}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {analytics.macros.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number, name: string) => [
                    `${Math.round(value)} cal`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {analytics.macros.map((macro, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-sm text-muted-foreground">{macro.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Meal Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={analytics.meals}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
                <Bar dataKey="calories" fill="#06b6d4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Foods */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Most Logged Foods (30 days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topFoods.map((item, index) => (
                <div key={item.food.id} className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium truncate">{item.food.name}</p>
                    <p className="text-muted-foreground text-sm">
                      {item.count} times • {Math.round(item.totalCalories)} total cal
                    </p>
                  </div>
                  <Badge variant="outline" className="text-cyan-400 border-cyan-400/30">
                    {Math.round(item.totalCalories / item.count)} avg cal
                  </Badge>
                </div>
              ))}
              {analytics.topFoods.length === 0 && (
                <div className="text-center py-8">
                  <Clock className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground">No data yet</p>
                  <p className="text-muted-foreground/70 text-sm">Start logging food to see your favorites!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Averages */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">30-Day Averages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{analytics.monthly.calories}</div>
              <div className="text-sm text-muted-foreground">Avg Calories/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{analytics.monthly.protein}g</div>
              <div className="text-sm text-muted-foreground">Avg Protein/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{analytics.monthly.carbs}g</div>
              <div className="text-sm text-muted-foreground">Avg Carbs/day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{analytics.monthly.fat}g</div>
              <div className="text-sm text-muted-foreground">Avg Fat/day</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Helper function to calculate consecutive days streak
function calculateStreak(foodEntries: FoodEntry[]): number {
  if (foodEntries.length === 0) return 0;

  const uniqueDates = [...new Set(foodEntries.map(entry => entry.date))].sort();
  if (uniqueDates.length === 0) return 0;

  const today = format(new Date(), 'yyyy-MM-dd');
  let streak = 0;
  let currentDate = new Date();

  // Check if user logged today or yesterday (to account for different timezones)
  const lastLogDate = uniqueDates[uniqueDates.length - 1];
  const daysSinceLastLog = Math.floor(
    (new Date(today).getTime() - new Date(lastLogDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSinceLastLog > 1) {
    return 0; // Streak broken
  }

  // Count consecutive days backwards from the most recent log
  for (let i = uniqueDates.length - 1; i >= 0; i--) {
    const expectedDate = format(subDays(new Date(uniqueDates[uniqueDates.length - 1]), uniqueDates.length - 1 - i), 'yyyy-MM-dd');
    if (uniqueDates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export default NutritionAnalytics;
