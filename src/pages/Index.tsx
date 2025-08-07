import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthProvider';
import { 
  Sparkles, 
  Calendar, 
  TrendingUp, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Target,
  Moon
} from 'lucide-react';

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  const features = [
    {
      icon: Calendar,
      title: 'Morning Intentions',
      description: 'Start each day by setting your focus areas and committing to the Four Agreements'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your consistency and happiness trends over time'
    },
    {
      icon: Heart,
      title: 'Holistic Wellness',
      description: 'Track sleep, happiness, and personal growth in one beautiful interface'
    },
    {
      icon: Target,
      title: 'Focus Areas',
      description: 'Balance Physical, Mental, Social, Spiritual and other life dimensions'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-16 w-16 text-primary glow-primary animate-pulse" />
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gradient mb-6">
              Routine OS
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Your personal companion for building meaningful daily routines and tracking holistic wellness
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="glow-primary transition-bounce px-8">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="transition-smooth">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Everything you need for daily growth
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Combine ancient wisdom with modern tracking to build the life you want
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="card-gradient border-border shadow-card transition-smooth hover:shadow-glow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* The Four Agreements Section */}
      <div className="bg-muted/20 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
              Built on The Four Agreements
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Ancient Toltec wisdom integrated into your daily routine for personal transformation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Be impeccable with your word",
              "Don't take anything personally", 
              "Don't make assumptions",
              "Always do your best"
            ].map((agreement, index) => (
              <div key={index} className="flex items-center space-x-3 p-4 bg-card/50 rounded-lg border border-border/50">
                <CheckCircle className="h-6 w-6 text-success flex-shrink-0" />
                <span className="font-medium">{agreement}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gradient mb-4">
            Ready to transform your routines?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands who are building better habits and tracking their personal growth
          </p>
          <Link to="/login">
            <Button size="lg" className="glow-primary transition-bounce px-8">
              Start Your Journey
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Sparkles className="h-5 w-5" />
            <span>Built with ❤️ for personal growth</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
