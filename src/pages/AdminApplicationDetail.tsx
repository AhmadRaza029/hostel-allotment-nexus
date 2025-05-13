
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Application, Student } from '@/types';
import { format } from 'date-fns';
import { AlertCircle, ArrowLeft, CheckCircle, Loader2, User, XCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import DocumentViewer from '@/components/DocumentViewer';

interface AdminApplicationDetailProps {}

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(false);
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        // Fetch application details
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('id', id)
          .single();

        if (appError) throw appError;
        
        setApplication(appData);

        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', appData.student_id)
          .single();

        if (studentError) throw studentError;
        
        setStudent(studentData);
        setRemarks(appData.remarks || '');

      } catch (error) {
        console.error('Error fetching details:', error);
        toast.error('Failed to load application details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!application) return;
    
    setProcessingAction(true);
    try {
      let roomNumber = '';
      let hostelId = '';
      let paymentAmount = 0;
      
      if (status === 'APPROVED') {
        // Get preferred hostel
        const preferredHostelId = application.hostel_preference?.[0];
        
        if (!preferredHostelId) {
          toast.error('No hostel preference found in application');
          return;
        }
        
        // Get a random room number for this demo
        roomNumber = `${Math.floor(Math.random() * 500) + 100}`;
        hostelId = preferredHostelId;
        
        // Get fee amount from settings
        const { data: feeData, error: feeError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'hostel_fees')
          .single();
          
        if (feeError) throw feeError;
        
        const fees = feeData.value as { general: number, reserved: number };
        paymentAmount = application.category === 'GENERAL' ? fees.general : fees.reserved;
      }
      
      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          status: status,
          remarks: remarks,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);
        
      if (updateError) throw updateError;
      
      // If approved, create allocation
      if (status === 'APPROVED') {
        const { error: allocationError } = await supabase
          .from('allocations')
          .insert({
            application_id: application.id,
            hostel_id: hostelId,
            room_number: roomNumber,
            payment_status: 'PENDING',
            payment_amount: paymentAmount,
            allotment_date: new Date().toISOString()
          });
          
        if (allocationError) throw allocationError;
      }
      
      toast.success(`Application ${status.toLowerCase()} successfully`);
      
      // Update local state
      setApplication({
        ...application,
        status: status,
        remarks: remarks
      });
      
    } catch (error) {
      console.error('Error processing application:', error);
      toast.error(`Failed to ${status.toLowerCase()} application`);
    } finally {
      setProcessingAction(false);
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
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>
                  Review and process this application
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {application.status === 'PENDING' ? (
                    <>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">
                          Remarks / Comments
                        </label>
                        <Textarea
                          value={remarks}
                          onChange={(e) => setRemarks(e.target.value)}
                          placeholder="Add any notes or reasons for approval/rejection"
                          className="w-full"
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => handleAction('APPROVED')}
                          disabled={processingAction}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {processingAction ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="mr-2 h-4 w-4" />
                          )}
                          Approve Application
                        </Button>
                        
                        <Button
                          onClick={() => handleAction('REJECTED')}
                          disabled={processingAction}
                          variant="destructive"
                        >
                          {processingAction ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="mr-2 h-4 w-4" />
                          )}
                          Reject Application
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center mb-4">
                        <div 
                          className={`h-12 w-12 rounded-full flex items-center justify-center mr-4
                            ${application.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'}`}
                        >
                          {application.status === 'APPROVED' ? (
                            <CheckCircle className="h-6 w-6 text-green-600" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold">
                            Application {application.status.toLowerCase()}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(application.updated_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      
                      {application.remarks && (
                        <div>
                          <label className="block text-sm font-medium mb-1">
                            Remarks / Comments
                          </label>
                          <div className="p-3 bg-gray-50 rounded-md text-sm">
                            {application.remarks}
                          </div>
                        </div>
                      )}
                      
                      {application.status === 'APPROVED' && (
                        <Button
                          onClick={() => navigate(`/admin/allocation/${application.id}`)}
                          className="w-full mt-2"
                        >
                          View Allocation Details
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
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
