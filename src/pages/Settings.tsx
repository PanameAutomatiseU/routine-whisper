import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { 
  Settings as SettingsIcon, 
  Download, 
  Trash2, 
  AlertTriangle,
  User,
  Database
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleExportJSON = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const exportData = {
        user_email: user.email,
        export_date: new Date().toISOString(),
        routines: data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `routine-os-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your routine data has been downloaded as JSON",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('routines')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;

      // Create CSV content
      const headers = [
        'Date', 'Happiness', 'Sleep Hours', 'Focus Areas', 'Focus Description',
        'Toltec Word', 'Toltec Personal', 'Toltec Assume', 'Toltec Best'
      ];

      const csvContent = [
        headers.join(','),
        ...data.map(row => [
          row.date,
          row.happiness || '',
          row.sleep_hours || '',
          (row.focus_areas || []).join(';'),
          row.focus_desc ? `"${row.focus_desc.replace(/"/g, '""')}"` : '',
          row.toltec_word ? 'Yes' : 'No',
          row.toltec_personal ? 'Yes' : 'No',
          row.toltec_assume ? 'Yes' : 'No',
          row.toltec_best ? 'Yes' : 'No'
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `routine-os-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export successful",
        description: "Your routine data has been downloaded as CSV",
        variant: "default"
      });
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Delete all user routines first (due to CASCADE this should happen automatically, but being explicit)
      const { error: routinesError } = await supabase
        .from('routines')
        .delete()
        .eq('user_id', user.id);

      if (routinesError) throw routinesError;

      // Sign out the user
      await signOut();
      
      toast({
        title: "Account deleted",
        description: "Your account and all data have been permanently deleted",
        variant: "default"
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        title: "Deletion failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2 flex items-center">
            <SettingsIcon className="mr-3 h-8 w-8" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your account and export your data
          </p>
        </div>

        {/* Account Information */}
        <Card className="card-gradient border-border shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="mr-2 h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your account details and current subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm text-muted-foreground">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">User ID:</span>
                <span className="text-sm text-muted-foreground font-mono">{user?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Member since:</span>
                <span className="text-sm text-muted-foreground">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Export */}
        <Card className="card-gradient border-border shadow-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5" />
              Data Export
            </CardTitle>
            <CardDescription>
              Download your routine data in different formats
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                <div>
                  <h4 className="font-medium">JSON Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Complete data export including all metadata
                  </p>
                </div>
                <Button 
                  onClick={handleExportJSON} 
                  disabled={loading}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export JSON
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                <div>
                  <h4 className="font-medium">CSV Export</h4>
                  <p className="text-sm text-muted-foreground">
                    Spreadsheet-friendly format for analysis
                  </p>
                </div>
                <Button 
                  onClick={handleExportCSV} 
                  disabled={loading}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="card-gradient border-destructive/50 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="mr-2 h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Irreversible actions that will permanently delete your data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <h4 className="font-medium text-destructive mb-2">Delete Account</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This will permanently delete your account and all associated routine data. 
                This action cannot be undone.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" disabled={loading}>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your
                      account and all of your routine data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Yes, delete my account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}