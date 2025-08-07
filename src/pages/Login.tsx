import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { Mail, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [linkSent, setLinkSent] = useState(false);
  const { signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    const { error } = await signIn(email);
    setLoading(false);

    if (error) {
      toast({
        title: "Authentication Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      setLinkSent(true);
      toast({
        title: "Magic link sent!",
        description: "Check your email for the login link.",
        variant: "default"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-hero">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="h-10 w-10 text-primary glow-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Routine OS</h1>
          <p className="text-muted-foreground">Your personal routine companion</p>
        </div>

        <Card className="card-gradient border-border shadow-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back</CardTitle>
            <CardDescription>
              {linkSent ? 
                "Check your email for the magic link" : 
                "Enter your email to receive a magic link"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!linkSent ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="pierre@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="transition-smooth"
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full glow-primary" 
                  disabled={loading}
                >
                  {loading ? (
                    "Sending magic link..."
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Magic Link
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="text-center space-y-4">
                <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                  <Mail className="h-8 w-8 text-success mx-auto mb-2" />
                  <p className="text-success-foreground">
                    Magic link sent to <strong>{email}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Click the link in your email to sign in instantly
                  </p>
                </div>
                <Button 
                  variant="secondary" 
                  onClick={() => setLinkSent(false)}
                  className="w-full"
                >
                  Try different email
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}