import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Application, Student, Hostel, Allocation, JsonValue } from '@/types';
import { AlertCircle, AlertTriangle, CalendarIcon, Check, CheckCircle, FileText, Home, Loader2, MapPin, School, User, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Application | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        setApplication({
          ...appData,
          status: appData.status as "PENDING" | "APPROVED" | "REJECTED"
        });
        setRemarks(appData.remarks || '');

        // Fetch student details
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', appData.student_id)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        // Fetch allocation if exists
        if (appData.status === 'APPROVED') {
          const { data: allocData, error: allocError } = await supabase
            .from('allocations')
            .select('*')
            .eq('application_id', id)
            .single();

          if (!allocError && allocData) {
            setAllocation({
              ...allocData,
              payment_status: allocData.payment_status as "PENDING" | "COMPLETED" | "FAILED"
            });
          }
        }

        // Fetch all hostels
        const { data: hostelData, error: hostelError } = await supabase
          .from('hostels')
          .select('*');

        if (hostelError) throw hostelError;
        setHostels(hostelData || []);

      } catch (error) {
        console.error('Error fetching application details:', error);
        toast.error('Failed to load application details');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleStatusUpdate = async (status: "PENDING" | "APPROVED" | "REJECTED") => {
    if (!application) return;

    setIsSubmitting(true);
    try {
      const updateData = { 
        status, 
        remarks: remarks || null,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', application.id);

      if (error) throw error;

      // Update local state
      setApplication({
        ...application,
        ...updateData
      });

      toast.success(`Application ${status.toLowerCase()}`);
      
      // If approved, show option to allocate room
      if (status === 'APPROVED' && !allocation) {
        toast.info('You can now allocate a room for this student');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAllocateRoom = async (hostelId: string) => {
    if (!application) return;

    setIsSubmitting(true);
    try {
      // Generate a room number (in a real app, this would be more sophisticated)
      const roomNumber = `${Math.floor(Math.random() * 500) + 100}`;
      
      // Get fee amount from settings
      const { data: feeData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hostel_fees')
        .single();
        
      const feeValue = feeData.value as JsonValue;
      const feeAmount = application.category === 'GENERAL' ? 
        (feeValue as {general: number, reserved: number}).general : 
        (feeValue as {general: number, reserved: number}).reserved;

      // Create allocation
      const { data, error } = await supabase
        .from('allocations')
        .insert({
          application_id: application.id,
          hostel_id: hostelId,
          room_number: roomNumber,
          payment_status: 'PENDING',
          payment_amount: feeAmount
        })
        .select()
        .single();

      if (error) throw error;
      
      setAllocation({
        ...data,
        payment_status: data.payment_status as "PENDING" | "COMPLETED" | "FAILED"
      });
      toast.success('Room allocated successfully');
    } catch (error) {
      console.error('Error allocating room:', error);
      toast.error('Failed to allocate room');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getHostelNameById = (hostelId: string) => {
    const hostel = hostels.find(h => h.id === hostelId);
    return hostel ? hostel.name : 'Unknown';
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
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Application details not found or could not be loaded.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
            <Button onClick={() => navigate('/admin')}>
              Return to Dashboard
            </Button>
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
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Application Details</h1>
            <p className="text-muted-foreground">
              Submitted on {format(new Date(application.created_at), 'MMMM dd, yyyy')}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Application #{application.id.substring(0, 8)}</CardTitle>
                {getStatusBadge(application.status)}
              </div>
              <CardDescription>
                Academic Year: {application.academic_year}, Current Year: {application.current_year}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Home Address & Distance */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Home Address</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <div>
                    <p>{application.home_address}</p>
                    {application.distance_km && (
                      <p className="text-sm text-muted-foreground">
                        Distance from campus: {application.distance_km} km
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Academic Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-sm font-semibold mb-1">Current Year</h3>
                  <p>{application.current_year}</p>
                </div>
                {application.cgpa && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">CGPA</h3>
                    <p>{application.cgpa}</p>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold mb-1">Category</h3>
                  <p>{application.category || 'Not specified'}</p>
                </div>
                {application.annual_income && (
                  <div>
                    <h3 className="text-sm font-semibold mb-1">Annual Income</h3>
                    <p>₹{application.annual_income.toLocaleString()}</p>
                  </div>
                )}
              </div>
              
              <Separator />
              
              {/* Hostel Preferences */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Hostel Preferences</h3>
                {application.hostel_preference && application.hostel_preference.length > 0 ? (
                  <ol className="list-decimal list-inside space-y-1">
                    {application.hostel_preference.map((hostelId, index) => (
                      <li key={index}>{getHostelNameById(hostelId)}</li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-muted-foreground">No preferences specified</p>
                )}
              </div>
              
              <Separator />
              
              {/* Supporting Documents */}
              <div>
                <h3 className="text-sm font-semibold mb-2">Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start" disabled={!application.photo_id_url}>
                    <FileText className="h-4 w-4 mr-2" />
                    {application.photo_id_url ? 'View Photo ID' : 'No Photo ID Uploaded'}
                  </Button>
                  <Button variant="outline" className="justify-start" disabled={!application.income_cert_url}>
                    <FileText className="h-4 w-4 mr-2" />
                    {application.income_cert_url ? 'View Income Certificate' : 'No Income Certificate Uploaded'}
                  </Button>
                </div>
              </div>
              
              {/* Allocation Information */}
              {allocation && (
                <>
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-semibold mb-2">Room Allocation</h3>
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <h4 className="text-xs text-muted-foreground">Hostel</h4>
                            <p>{getHostelNameById(allocation.hostel_id)}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-muted-foreground">Room Number</h4>
                            <p>{allocation.room_number}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-muted-foreground">Payment Status</h4>
                            <Badge className={allocation.payment_status === 'COMPLETED' ? 
                              'bg-green-600' : 'bg-yellow-600'}>
                              {allocation.payment_status}
                            </Badge>
                          </div>
                        </div>
                        <div className="mt-2">
                          <h4 className="text-xs text-muted-foreground">Allocated On</h4>
                          <p>{format(new Date(allocation.allotment_date), 'MMMM dd, yyyy')}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
              
              {/* Remarks */}
              <Separator />
              
              <div>
                <h3 className="text-sm font-semibold mb-2">Admin Remarks</h3>
                <Textarea 
                  placeholder="Enter notes or reasons for approval/rejection" 
                  value={remarks} 
                  onChange={(e) => setRemarks(e.target.value)}
                  className="min-h-[100px]"
                  disabled={application.status !== 'PENDING' && !['ADMIN', 'SUPERADMIN'].includes(application.status)}
                />
              </div>
            </CardContent>
            
            {application.status === 'PENDING' && (
              <CardFooter className="flex justify-end gap-4">
                <Button 
                  variant="outline" 
                  className="border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleStatusUpdate('REJECTED')}
                  disabled={isSubmitting}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleStatusUpdate('APPROVED')}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </CardFooter>
            )}
            
            {application.status === 'APPROVED' && !allocation && (
              <CardFooter>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Room allocation needed</AlertTitle>
                  <AlertDescription>
                    This application has been approved but no room has been allocated yet.
                    Please allocate a room from the student's preferences.
                  </AlertDescription>
                </Alert>
              </CardFooter>
            )}
          </Card>
          
          <div className="space-y-6">
            {/* Student Info Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Student Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-12 w-12 rounded-full bg-hostel-light flex items-center justify-center">
                    <User className="h-6 w-6 text-hostel-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                    <p className="text-sm text-muted-foreground mt-1">{student.phone || 'No phone number'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <h4 className="text-xs text-muted-foreground">Gender</h4>
                    <p>{student.gender}</p>
                  </div>
                  <div>
                    <h4 className="text-xs text-muted-foreground">Department</h4>
                    <p>{student.department}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Room Allocation Card (if not yet allocated) */}
            {application.status === 'APPROVED' && !allocation && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Allocate Room</CardTitle>
                  <CardDescription>
                    Select a hostel from student's preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {application.hostel_preference?.map((hostelId) => {
                    const hostel = hostels.find(h => h.id === hostelId);
                    if (!hostel) return null;
                    
                    return (
                      <Button 
                        key={hostelId}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => handleAllocateRoom(hostelId)}
                        disabled={isSubmitting}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        {hostel.name}
                        <span className="ml-auto text-xs">
                          {hostel.available_rooms} rooms
                        </span>
                      </Button>
                    );
                  })}
                  
                  {(!application.hostel_preference || application.hostel_preference.length === 0) && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>No hostel preferences</AlertTitle>
                      <AlertDescription>
                        Student did not specify any hostel preferences.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
            
            {/* Application Priority Score */}
            {application.status === 'PENDING' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Priority Assessment</CardTitle>
                  <CardDescription>
                    Calculated based on distance, income and CGPA
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Distance Factor</span>
                    <span className="font-medium">
                      {application.distance_km ? 
                        (Math.min(application.distance_km, 1000) / 1000 * 10).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Economic Factor</span>
                    <span className="font-medium">
                      {application.annual_income ? 
                        (10 - Math.min(application.annual_income, 1000000) / 1000000 * 10).toFixed(2) : 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Academic Factor</span>
                    <span className="font-medium">
                      {application.cgpa ? application.cgpa : 'N/A'}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Overall Score</span>
                    <span className="font-semibold text-lg">
                      {/* This is a simplified calculation - in a real app this would use the actual formula */}
                      {(
                        (application.distance_km ? Math.min(application.distance_km, 1000) / 1000 * 4 : 0) +
                        (application.annual_income ? (10 - Math.min(application.annual_income, 1000000) / 1000000 * 10) * 0.6 : 0) +
                        (application.cgpa ? application.cgpa / 10 : 0)
                      ).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminApplicationDetail;
