import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FocusAreaSelect } from '@/components/forms/FocusAreaSelect';
import { ToltecAgreements } from '@/components/forms/ToltecAgreements';
import { Sun, Sparkles, Send } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

interface RoutineFormData {
  focus_areas: string[];
  focus_desc: string;
  toltec_word: boolean;
  toltec_personal: boolean;
  toltec_assume: boolean;
  toltec_best: boolean;
}

export default function MorningForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RoutineFormData>({
    focus_areas: [],
    focus_desc: '',
    toltec_word: false,
    toltec_personal: false,
    toltec_assume: false,
    toltec_best: false,
  });

  // Load existing data for today if it exists
  useEffect(() => {
    if (!user) return;

    const loadTodayData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (data && !error) {
        setFormData({
          focus_areas: data.focus_areas || [],
          focus_desc: data.focus_desc || '',
          toltec_word: data.toltec_word || false,
          toltec_personal: data.toltec_personal || false,
          toltec_assume: data.toltec_assume || false,
          toltec_best: data.toltec_best || false,
        });
      }
    };

    loadTodayData();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { error } = await supabase
        .from('routines')
        .upsert({
          user_id: user.id,
          date: today,
          ...formData,
        });

      if (error) throw error;

      toast({
        title: "Morning routine saved! ✨",
        description: "Your intentions for today have been set. Have a great day!",
        variant: "default"
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error saving routine",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToltecChange = (key: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [key]: checked }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sun className="h-12 w-12 text-primary glow-primary animate-pulse" />
          </div>
          <h1 className="text-4xl font-bold text-gradient mb-2">
            It's gonna be a goooood day! ✨
          </h1>
          <p className="text-lg text-muted-foreground">
            Set your intentions and focus areas for today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <FocusAreaSelect
            value={formData.focus_areas}
            onChange={(areas) => setFormData(prev => ({ ...prev, focus_areas: areas }))}
          />

          <Card className="card-gradient border-border">
            <CardHeader>
              <CardTitle className="text-lg">Describe How</CardTitle>
              <CardDescription>
                How will you approach your focus areas today? What's your plan?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Today I will focus on my physical health by going for a 30-minute walk and eating nutritious meals. For my professional development, I'll dedicate 2 hours to learning new skills..."
                value={formData.focus_desc}
                onChange={(e) => setFormData(prev => ({ ...prev, focus_desc: e.target.value }))}
                className="min-h-32 transition-smooth"
                rows={4}
              />
            </CardContent>
          </Card>

          <ToltecAgreements
            values={formData}
            onChange={handleToltecChange}
          />

          <div className="flex justify-center pt-4">
            <Button 
              type="submit" 
              size="lg"
              className="glow-primary transition-bounce px-8"
              disabled={loading}
            >
              {loading ? (
                "Saving your intentions..."
              ) : (
                <>
                  <Send className="mr-2 h-5 w-5" />
                  Set My Intentions
                  <Sparkles className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}