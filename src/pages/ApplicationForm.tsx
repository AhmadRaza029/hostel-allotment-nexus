
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Student, Hostel } from '@/types';

// Import our new components
import BasicInfoSection from '@/components/application-form/BasicInfoSection';
import DocumentUploadSection from '@/components/application-form/DocumentUploadSection';
import HostelPreferencesSection from '@/components/application-form/HostelPreferencesSection';
import TermsAndConditionsSection from '@/components/application-form/TermsAndConditionsSection';
import { useApplicationForm } from '@/hooks/useApplicationForm';

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<Student | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [applicationPeriodOpen, setApplicationPeriodOpen] = useState(true);
  
  // Use our custom hook
  const {
    form,
    photoIdFile,
    incomeCertFile,
    paymentSlipFile,
    handlePhotoIdChange,
    handleIncomeCertChange,
    handlePaymentSlipChange,
    onSubmit,
    submitting,
    uploading
  } = useApplicationForm(user?.id || '');

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

          if (studentError) throw studentError;
          setStudent(studentData);

          // Check for existing applications
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (applicationError) throw applicationError;
          
          if (applicationData && applicationData.length > 0) {
            setHasExistingApplication(true);
            
            if (applicationData[0].status !== 'REJECTED') {
              toast.info("You already have an application in process");
              navigate('/dashboard');
              return;
            }
          }

          // Fetch hostels matching student gender
          const { data: hostelData, error: hostelError } = await supabase
            .from('hostels')
            .select('*')
            .eq('gender', studentData.gender);

          if (hostelError) throw hostelError;
          setHostels(hostelData);

          // Check application period
          const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'application_dates')
            .single();

          if (settingsError) throw settingsError;

          if (settingsData) {
            const value = settingsData.value as { start: string, end: string };
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            const now = new Date();
            
            setApplicationPeriodOpen(now >= startDate && now <= endDate);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load required data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-hostel-primary mr-2" />
          <span>Loading application form...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Student profile not found. Please contact support.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  if (!applicationPeriodOpen) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application period is closed</AlertTitle>
            <AlertDescription>
              The application window is currently closed. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Hostel Application Form</h1>
            <p className="text-muted-foreground">
              Fill in the details below to apply for hostel accommodation.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide accurate details for your application.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <BasicInfoSection form={form} />
                  
                  <DocumentUploadSection 
                    photoIdFile={photoIdFile}
                    incomeCertFile={incomeCertFile}
                    paymentSlipFile={paymentSlipFile}
                    handlePhotoIdChange={handlePhotoIdChange}
                    handleIncomeCertChange={handleIncomeCertChange}
                    handlePaymentSlipChange={handlePaymentSlipChange}
                  />
                  
                  <HostelPreferencesSection form={form} hostels={hostels} />
                  
                  <TermsAndConditionsSection form={form} />
                  
                  <Button type="submit" disabled={submitting || !photoIdFile || !paymentSlipFile}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {uploading ? "Uploading Documents..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationForm;
