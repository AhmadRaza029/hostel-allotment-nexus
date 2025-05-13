
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatDistanceToNow } from 'date-fns';
import { AlertCircle, AlertTriangle, CheckCircle, FileText, Home, Loader2, Receipt, User } from 'lucide-react';
import { Application, Allocation, Student, Hostel } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Dashboard = () => {
  const { user } = useAuth();
  const [application, setApplication] = useState<Application | null>(null);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingFees, setPendingFees] = useState(0);
  const [applicationPeriodActive, setApplicationPeriodActive] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        // Fetch student profile
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('id', user.id)
          .single();

        if (studentError) throw studentError;
        setStudent(studentData);

        // Fetch application
        const { data: appData, error: appError } = await supabase
          .from('applications')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (appError) throw appError;
        
        if (appData && appData.length > 0) {
          setApplication(appData[0]);
          
          // If application is approved, fetch allocation
          if (appData[0].status === 'APPROVED') {
            const { data: allocData, error: allocError } = await supabase
              .from('allocations')
              .select('*')
              .eq('application_id', appData[0].id)
              .single();
              
            if (!allocError && allocData) {
              setAllocation(allocData);
              setPendingFees(allocData.payment_amount || 0);
              
              // Fetch hostel info
              if (allocData.hostel_id) {
                const { data: hostelData, error: hostelError } = await supabase
                  .from('hostels')
                  .select('*')
                  .eq('id', allocData.hostel_id)
                  .single();
                  
                if (!hostelError) {
                  setHostel(hostelData);
                }
              }
            }
          }
        }

        // Check if application period is active
        const { data: settingsData, error: settingsError } = await supabase
          .from('settings')
          .select('*')
          .eq('key', 'application_dates')
          .single();

        if (!settingsError && settingsData) {
          const value = settingsData.value as { start: string, end: string };
          const startDate = new Date(value.start);
          const endDate = new Date(value.end);
          const now = new Date();
          
          setApplicationPeriodActive(now >= startDate && now <= endDate);
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

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

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-500">Failed</Badge>;
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
          <span>Loading dashboard...</span>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-8">Student Dashboard</h1>
        
        {!student && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Profile Not Found</AlertTitle>
            <AlertDescription>
              Your student profile could not be found. Please contact the administrator.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-6 md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Application Status</CardTitle>
                <CardDescription>View your hostel application status</CardDescription>
              </CardHeader>
              
              <CardContent>
                {!application ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No Application Found</h3>
                    <p className="text-muted-foreground mb-4">
                      You haven't submitted a hostel application yet.
                    </p>
                    {applicationPeriodActive ? (
                      <Button asChild>
                        <Link to="/apply">Apply Now</Link>
                      </Button>
                    ) : (
                      <Alert className="mt-2 mx-auto max-w-md">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Application Period Closed</AlertTitle>
                        <AlertDescription>
                          Hostel applications are currently closed. Please check back later.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="font-medium">Application #{application.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <Table>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Academic Year</TableCell>
                          <TableCell>{application.academic_year}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Year of Study</TableCell>
                          <TableCell>{application.current_year}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Documents Submitted</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {application.photo_id_url && (
                                <Badge variant="outline" className="flex gap-1 items-center">
                                  <FileText className="h-3 w-3" /> ID Proof
                                </Badge>
                              )}
                              {application.income_cert_url && (
                                <Badge variant="outline" className="flex gap-1 items-center">
                                  <FileText className="h-3 w-3" /> Income Certificate
                                </Badge>
                              )}
                              {application.payment_slip_url && (
                                <Badge variant="outline" className="flex gap-1 items-center">
                                  <Receipt className="h-3 w-3" /> Payment Receipt
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    
                    {application.status === 'APPROVED' ? (
                      <Alert className="mt-6 bg-green-50 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertTitle>Application Approved</AlertTitle>
                        <AlertDescription>
                          Your hostel application has been approved. Please check allocation details.
                        </AlertDescription>
                      </Alert>
                    ) : application.status === 'REJECTED' ? (
                      <Alert variant="destructive" className="mt-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Application Rejected</AlertTitle>
                        <AlertDescription>
                          {application.remarks || 'Your application does not meet the eligibility criteria.'}
                          {applicationPeriodActive && (
                            <div className="mt-2">
                              <Button asChild size="sm">
                                <Link to="/apply">Apply Again</Link>
                              </Button>
                            </div>
                          )}
                        </AlertDescription>
                      </Alert>
                    ) : (
                      <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <AlertTitle>Application Under Review</AlertTitle>
                        <AlertDescription>
                          Your application is currently being reviewed. We'll notify you when a decision is made.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
            
            {application?.status === 'APPROVED' && allocation && (
              <Card>
                <CardHeader>
                  <CardTitle>Hostel Allocation</CardTitle>
                  <CardDescription>Your room allocation details</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Hostel Name</p>
                        <p className="font-medium">{hostel?.name || 'Not assigned'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Room Number</p>
                        <p className="font-medium">{allocation.room_number}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Allotment Date</p>
                        <p className="font-medium">
                          {new Date(allocation.allotment_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Status</p>
                        <p className="font-medium">
                          {getPaymentStatusBadge(allocation.payment_status)}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="font-medium mb-2">Payment Details</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        {allocation.payment_status === 'PENDING' ? (
                          <>
                            <p className="mb-2">
                              <span className="font-medium">Amount Due:</span> ₹{allocation.payment_amount?.toLocaleString() || '0'}
                            </p>
                            <Button asChild>
                              <Link to="/allocation">Pay Hostel Fees</Link>
                            </Button>
                          </>
                        ) : allocation.payment_status === 'COMPLETED' ? (
                          <div className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                            <p className="font-medium">Payment Complete - ₹{allocation.payment_amount?.toLocaleString() || '0'}</p>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                            <div>
                              <p className="font-medium">Payment Failed</p>
                              <p className="text-sm text-muted-foreground">Please try again</p>
                              <Button className="mt-2" size="sm" asChild>
                                <Link to="/allocation">Try Again</Link>
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Button asChild>
                      <Link to="/allocation">
                        View Full Allocation Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Student Profile</CardTitle>
              </CardHeader>
              
              <CardContent>
                {student ? (
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-hostel-primary/10 flex items-center justify-center mr-3">
                        <User className="h-6 w-6 text-hostel-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.department}</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {student.email}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {student.phone || "Not provided"}
                      </p>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Gender:</span>{" "}
                        {student.gender}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <User className="h-12 w-12 text-muted-foreground mb-2" />
                    <p>Profile not found</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Important Links</CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link to="/rules">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Hostel Rules & Guidelines
                    </Link>
                  </Button>
                  
                  {!application && applicationPeriodActive && (
                    <Button className="w-full justify-start" asChild>
                      <Link to="/apply">
                        <FileText className="mr-2 h-4 w-4" />
                        Apply for Hostel
                      </Link>
                    </Button>
                  )}
                  
                  {allocation && (
                    <Button className="w-full justify-start" asChild>
                      <Link to="/allocation">
                        <Home className="mr-2 h-4 w-4" />
                        View Allocation Details
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {application?.status === 'APPROVED' && allocation && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Complete Your Admission</AlertTitle>
                <AlertDescription>
                  Please complete your hostel fee payment to finalize your admission.
                </AlertDescription>
                {allocation.payment_status === 'PENDING' && (
                  <Button size="sm" className="mt-2" asChild>
                    <Link to="/allocation">Pay Now</Link>
                  </Button>
                )}
              </Alert>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
