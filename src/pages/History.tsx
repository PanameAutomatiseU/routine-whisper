import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { format } from 'date-fns';
import { History as HistoryIcon, Filter, Calendar, Target } from 'lucide-react';

interface Routine {
  id: string;
  date: string;
  happiness: string | null;
  sleep_hours: number | null;
  focus_areas: string[] | null;
  focus_desc: string | null;
  toltec_word: boolean;
  toltec_personal: boolean;
  toltec_assume: boolean;
  toltec_best: boolean;
}

const FOCUS_AREAS = [
  'Physical', 'Social', 'Mental', 'Spiritual', 
  'Creative', 'Professional', 'Financial', 'Environmental'
];

export default function History() {
  const { user } = useAuth();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [filteredRoutines, setFilteredRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterArea, setFilterArea] = useState<string>('all');

  useEffect(() => {
    if (!user) return;

    const loadRoutines = async () => {
      try {
        const { data, error } = await supabase
          .from('routines')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false })
          .limit(30);

        if (error) throw error;
        setRoutines(data || []);
        setFilteredRoutines(data || []);
      } catch (error) {
        console.error('Error loading routines:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutines();
  }, [user]);

  useEffect(() => {
    if (filterArea === 'all') {
      setFilteredRoutines(routines);
    } else {
      setFilteredRoutines(
        routines.filter(routine => 
          routine.focus_areas?.includes(filterArea)
        )
      );
    }
  }, [filterArea, routines]);

  const getHappinessColor = (happiness: string | null) => {
    switch (happiness) {
      case 'High': return 'bg-success text-success-foreground';
      case 'Medium': return 'bg-warning text-warning-foreground';
      case 'Low': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getToltecCompletionCount = (routine: Routine) => {
    return [
      routine.toltec_word,
      routine.toltec_personal,
      routine.toltec_assume,
      routine.toltec_best
    ].filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
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
            <h1 className="text-3xl font-bold text-gradient mb-2 flex items-center">
              <HistoryIcon className="mr-3 h-8 w-8" />
              Routine History
            </h1>
            <p className="text-muted-foreground">
              Track your progress and patterns over time
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger className="w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by focus area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All focus areas</SelectItem>
                {FOCUS_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>{area}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredRoutines.length === 0 ? (
          <Card className="card-gradient border-border text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No routines found</h3>
              <p className="text-muted-foreground mb-4">
                {filterArea === 'all' 
                  ? "You haven't created any routines yet." 
                  : `No routines found for ${filterArea} focus area.`
                }
              </p>
              <Button variant="outline" onClick={() => setFilterArea('all')}>
                Clear filter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRoutines.map((routine) => (
              <Card key={routine.id} className="card-gradient border-border shadow-card transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {format(new Date(routine.date), 'EEEE, MMMM d, yyyy')}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      {routine.happiness && (
                        <Badge className={getHappinessColor(routine.happiness)}>
                          {routine.happiness}
                        </Badge>
                      )}
                      {routine.sleep_hours && (
                        <Badge variant="outline">
                          {routine.sleep_hours}h sleep
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Focus Areas */}
                  {routine.focus_areas && routine.focus_areas.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center">
                        <Target className="mr-2 h-4 w-4" />
                        Focus Areas:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {routine.focus_areas.map((area) => (
                          <Badge key={area} variant="secondary">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Focus Description */}
                  {routine.focus_desc && (
                    <div>
                      <p className="text-sm font-medium mb-2">Description:</p>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {routine.focus_desc}
                      </p>
                    </div>
                  )}

                  {/* Toltec Agreements */}
                  <div>
                    <p className="text-sm font-medium mb-2">Four Agreements:</p>
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-4 text-xs">
                        <span className={routine.toltec_word ? 'text-success' : 'text-muted-foreground'}>
                          Word ✓
                        </span>
                        <span className={routine.toltec_personal ? 'text-success' : 'text-muted-foreground'}>
                          Personal ✓
                        </span>
                        <span className={routine.toltec_assume ? 'text-success' : 'text-muted-foreground'}>
                          Assume ✓
                        </span>
                        <span className={routine.toltec_best ? 'text-success' : 'text-muted-foreground'}>
                          Best ✓
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getToltecCompletionCount(routine)}/4 completed
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}