import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { 
  TrendingUp, 
  Moon, 
  Heart, 
  Target, 
  Calendar,
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface RoutineStats {
  todayHappiness: string | null;
  todaySleepHours: number | null;
  completionRate: number;
  totalRoutines: number;
  focusAreas: string[];
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<RoutineStats>({
    todayHappiness: null,
    todaySleepHours: null,
    completionRate: 0,
    totalRoutines: 0,
    focusAreas: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadStats = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        
        // Get today's routine
        const { data: todayData } = await supabase
          .from('routines')
          .select('*')
          .eq('user_id', user.id)
          .eq('date', today)
          .maybeSingle();

        // Get all routines for completion rate
        const { data: allRoutines } = await supabase
          .from('routines')
          .select('date, focus_areas')
          .eq('user_id', user.id)
          .order('date', { ascending: false });

        // Calculate completion rate (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const last30Days = [];
        for (let i = 0; i < 30; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          last30Days.push(date.toISOString().split('T')[0]);
        }

        const completedDays = allRoutines?.filter(routine => 
          last30Days.includes(routine.date)
        ).length || 0;

        setStats({
          todayHappiness: todayData?.happiness || null,
          todaySleepHours: todayData?.sleep_hours || null,
          completionRate: Math.round((completedDays / 30) * 100),
          totalRoutines: allRoutines?.length || 0,
          focusAreas: todayData?.focus_areas || []
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();

    // Subscribe to realtime updates
    const channel = supabase
      .channel('routines-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'routines',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          loadStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const getHappinessColor = (happiness: string | null) => {
    switch (happiness) {
      case 'High': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'Low': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-32 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">
              Welcome back, {user?.email?.split('@')[0]}! 👋
            </h1>
            <p className="text-muted-foreground">
              Here's how your routine journey is going
            </p>
          </div>
          <Link to="/morning-form">
            <Button className="glow-primary">
              <Calendar className="mr-2 h-4 w-4" />
              Today's Routine
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-gradient border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Happiness</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={getHappinessColor(stats.todayHappiness)}>
                  {stats.todayHappiness || 'Not set'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                How are you feeling today?
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sleep Hours</CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.todaySleepHours || '0'}h
              </div>
              <p className="text-xs text-muted-foreground">
                Last night's sleep
              </p>
            </CardContent>
          </Card>

          <Card className="card-gradient border-border shadow-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completionRate}%</div>
              <Progress value={stats.completionRate} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Last 30 days consistency
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Focus Areas */}
        {stats.focusAreas.length > 0 && (
          <Card className="card-gradient border-border shadow-card mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="mr-2 h-5 w-5" />
                Today's Focus Areas
              </CardTitle>
              <CardDescription>
                Areas you're focusing on today
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {stats.focusAreas.map((area) => (
                  <Badge key={area} variant="default" className="glow-primary">
                    {area}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card className="card-gradient border-border shadow-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Jump to different sections of your routine tracker
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/morning-form">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <Calendar className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Morning Form</div>
                    <div className="text-sm text-muted-foreground">Set today's intentions</div>
                  </div>
                </Button>
              </Link>
              <Link to="/history">
                <Button variant="outline" className="w-full justify-start h-auto p-4">
                  <TrendingUp className="mr-3 h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">View History</div>
                    <div className="text-sm text-muted-foreground">See your progress</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}