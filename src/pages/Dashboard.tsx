
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock, FileText, Home, Info } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Application, Student } from '@/types';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<{
    applicationPeriodOpen: boolean;
    startDate: Date;
    endDate: Date;
  }>({
    applicationPeriodOpen: false,
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch student profile
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single();

          if (studentError) {
            throw studentError;
          }

          setStudent(studentData);

          // Fetch application
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (appError) {
            throw appError;
          }

          if (appData && appData.length > 0) {
            setApplication(appData[0]);
          }

          // Fetch settings
          const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'application_dates')
            .single();

          if (settingsError) {
            throw settingsError;
          }

          if (settingsData) {
            const startDate = new Date(settingsData.value.start);
            const endDate = new Date(settingsData.value.end);
            const now = new Date();
            
            setSettings({
              applicationPeriodOpen: now >= startDate && now <= endDate,
              startDate,
              endDate,
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p>Loading your information...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'REJECTED':
        return 'bg-red-500';
      default:
        return 'bg-yellow-500';
    }
  };

  const renderApplicationStatus = () => {
    if (!application) {
      return (
        <div className="text-center py-8">
          <div className="mb-4">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No Application Found</h3>
          <p className="text-muted-foreground mb-4">You haven't submitted a hostel application yet.</p>
          
          {settings.applicationPeriodOpen ? (
            <Button asChild>
              <Link to="/apply">Apply Now</Link>
            </Button>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Application period is closed</AlertTitle>
              <AlertDescription>
                The next application window is from {format(settings.startDate, 'MMM dd, yyyy')} to {format(settings.endDate, 'MMM dd, yyyy')}
              </AlertDescription>
            </Alert>
          )}
        </div>
      );
    }

    return (
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Application Status</CardTitle>
            <Badge className={getStatusColor(application.status)}>
              {application.status}
            </Badge>
          </div>
          <CardDescription>
            Submitted on {format(new Date(application.created_at), 'MMM dd, yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Academic Year</h4>
              <p>{application.academic_year}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Year</h4>
              <p>{application.current_year}</p>
            </div>
            {application.status === 'APPROVED' && (
              <Button asChild className="md:col-span-2">
                <Link to="/allocation">View Allotment Details</Link>
              </Button>
            )}
            {application.status === 'PENDING' && (
              <div className="md:col-span-2 flex items-center justify-center p-4 bg-yellow-50 rounded-md">
                <Clock className="h-4 w-4 mr-2 text-yellow-500" />
                <p className="text-sm text-yellow-700">Your application is under review. You will be notified once processed.</p>
              </div>
            )}
            {application.status === 'REJECTED' && application.remarks && (
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Reason for Rejection</h4>
                <p className="text-red-600">{application.remarks}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Student Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Welcome, {student?.name}!</CardTitle>
              <CardDescription>{student?.department}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{student?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Student ID: {user?.id.substring(0, 8)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle>Application Period</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                {settings.applicationPeriodOpen ? (
                  <Alert className="border-green-500">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <AlertTitle>Applications Open</AlertTitle>
                    <AlertDescription>
                      Submissions are open until {format(settings.endDate, 'MMM dd, yyyy')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Applications Closed</AlertTitle>
                    <AlertDescription>
                      Next window: {format(settings.startDate, 'MMM dd, yyyy')} - {format(settings.endDate, 'MMM dd, yyyy')}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="status" className="mb-8">
          <TabsList>
            <TabsTrigger value="status">Application Status</TabsTrigger>
            <TabsTrigger value="info">Hostel Information</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status">
            {renderApplicationStatus()}
          </TabsContent>
          
          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hostel Facilities</CardTitle>
                  <CardDescription>Available amenities for students</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc list-inside space-y-2">
                    <li>24/7 Wi-Fi connectivity</li>
                    <li>Fully furnished rooms</li>
                    <li>Mess facilities with quality food</li>
                    <li>Laundry services</li>
                    <li>Reading rooms for studies</li>
                    <li>Indoor and outdoor games</li>
                    <li>Gym and recreational facilities</li>
                    <li>Clean drinking water</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Important Information</CardTitle>
                  <CardDescription>Rules and deadlines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold">Key Dates</h4>
                    <p className="text-sm">Application Period: {format(settings.startDate, 'MMM dd')} - {format(settings.endDate, 'MMM dd, yyyy')}</p>
                    <p className="text-sm">Allotment Results: Within 2 weeks of application closing</p>
                    <p className="text-sm">Payment Deadline: Within 7 days of allotment</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold">Required Documents</h4>
                    <p className="text-sm">ID Proof, Income Certificate, Address Proof</p>
                  </div>
                  
                  <Button asChild variant="outline" size="sm">
                    <Link to="/rules">View Complete Hostel Rules</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
