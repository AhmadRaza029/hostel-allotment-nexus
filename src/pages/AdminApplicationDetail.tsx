
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Application, Student } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, Loader2, User } from 'lucide-react';
import DocumentViewer from '@/components/DocumentViewer';
import ApplicationActionCard from '@/components/admin/ApplicationActionCard';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Enable realtime to track application changes
        await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .then(({ data, error }) => {
            // This query is to ensure we're subscribed to this item
            if (error) throw error;
          });

        // Fetch application details
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .single();

        if (appError) throw appError;
        
        setApplication({
          ...appData,
          status: appData.status as "PENDING" | "APPROVED" | "REJECTED"
        });

        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', appData.student_id)
          .single();

        if (studentError) throw studentError;
        
        setStudent(studentData);

      } catch (error) {
        console.error('Error fetching details:', error);
        toast({
          title: "Error",
          description: "Failed to load application details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleApplicationProcessed = (status: 'APPROVED' | 'REJECTED', remarks: string) => {
    if (application) {
      setApplication({
        ...application,
        status: status,
        remarks: remarks,
        updated_at: new Date().toISOString()
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-hostel-primary mr-2" />
          <span>Loading application details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!application || !student) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
          </Button>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
              <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
              <p className="text-muted-foreground">
                The requested application could not be found or has been deleted.
              </p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <Button variant="ghost" onClick={() => navigate('/admin')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-xl">Application #{application.id.slice(-8)}</CardTitle>
                    <CardDescription>
                      Submitted on {format(new Date(application.created_at), 'MMM dd, yyyy')}
                    </CardDescription>
                  </div>
                  {getStatusBadge(application.status)}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-6">
                  {/* Student Information section */}
                  <div>
                    <h3 className="text-lg font-medium">Student Information</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p className="font-medium">{student.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Student ID</p>
                        <p className="font-medium">{student.id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-medium">{student.department}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Current Year</p>
                        <p className="font-medium">{application.current_year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{student.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{student.phone || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Gender</p>
                        <p className="font-medium">{student.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Category</p>
                        <p className="font-medium">{application.category || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Application Details section */}
                  <div>
                    <h3 className="text-lg font-medium">Application Details</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Academic Year</p>
                        <p className="font-medium">{application.academic_year}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">CGPA</p>
                        <p className="font-medium">{application.cgpa || 'Not provided'}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">Home Address</p>
                        <p className="font-medium">{application.home_address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Distance from Campus</p>
                        <p className="font-medium">
                          {application.distance_km ? `${application.distance_km} KM` : 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Family Income</p>
                        <p className="font-medium">
                          {application.annual_income ? `₹${application.annual_income.toLocaleString()}` : 'Not provided'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Documents section */}
                  <div>
                    <h3 className="text-lg font-medium mb-4">Documents</h3>
                    <div className="space-y-4">
                      <DocumentViewer 
                        filePath={application.photo_id_url} 
                        label="Photo ID / Residence Certificate" 
                        docType="photo_id" 
                      />
                      
                      <DocumentViewer 
                        filePath={application.income_cert_url} 
                        label="Income Certificate" 
                        docType="income_cert" 
                      />
                      
                      <DocumentViewer 
                        filePath={application.payment_slip_url} 
                        label="University Payment Receipt" 
                        docType="payment_slip" 
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Hostel Preferences section */}
                  <div>
                    <h3 className="text-lg font-medium">Hostel Preferences</h3>
                    <div className="mt-2">
                      {application.hostel_preference && application.hostel_preference.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                          {application.hostel_preference.map((hostelId, index) => (
                            <li key={hostelId}>
                              <p className="font-medium">Preference {index + 1}: {hostelId}</p>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No hostel preferences specified</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Application Action Card */}
            <ApplicationActionCard 
              application={application} 
              onApplicationProcessed={handleApplicationProcessed} 
            />
            
            {/* Student Contact Card */}
            <Card>
              <CardHeader>
                <CardTitle>Student Contact</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 rounded-full bg-hostel-primary/10 flex items-center justify-center mr-3">
                    <User className="h-5 w-5 text-hostel-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-muted-foreground">{student.department}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">Email:</span> {student.email}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Phone:</span> {student.phone || 'Not provided'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminApplicationDetail;
