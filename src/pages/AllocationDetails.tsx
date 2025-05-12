
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Allocation, Application, Hostel } from '@/types';
import { CheckCircle, CreditCard, Download, Home, Loader2, Map, Receipt, User } from 'lucide-react';
import { format } from 'date-fns';

const AllocationDetails = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [application, setApplication] = useState<Application | null>(null);
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // First, get the latest approved application
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('student_id', user.id)
            .eq('status', 'APPROVED')
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          if (appError) throw appError;
          setApplication({
            ...appData,
            status: appData.status as "PENDING" | "APPROVED" | "REJECTED"
          });

          // Get allocation details
          const { data: allocData, error: allocError } = await supabase
            .from('allocations')
            .select('*')
            .eq('application_id', appData.id)
            .single();

          if (allocError) throw allocError;
          setAllocation({
            ...allocData,
            payment_status: allocData.payment_status as "PENDING" | "COMPLETED" | "FAILED"
          });

          // Get hostel details
          const { data: hostelData, error: hostelError } = await supabase
            .from('hostels')
            .select('*')
            .eq('id', allocData.hostel_id)
            .single();

          if (hostelError) throw hostelError;
          setHostel(hostelData);
        } catch (error) {
          console.error('Error fetching allocation details:', error);
          toast.error('Unable to load allocation details');
          navigate('/dashboard');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, navigate]);

  const handlePaymentSimulation = async () => {
    if (!allocation) return;

    setIsPaymentLoading(true);
    try {
      // In a real application, this would integrate with a payment gateway
      // For now, we'll simulate a successful payment after a short delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update payment status in database
      const { error } = await supabase
        .from('allocations')
        .update({ 
          payment_status: 'COMPLETED',
          updated_at: new Date().toISOString()
        })
        .eq('id', allocation.id);

      if (error) throw error;

      // Update local state
      setAllocation({
        ...allocation,
        payment_status: "COMPLETED",
        updated_at: new Date().toISOString()
      });

      toast.success('Payment successful!');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Payment processing failed');
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handleDownloadAllotmentLetter = () => {
    // In a real app, this would generate and download a PDF
    toast.info('Allotment letter download feature will be implemented soon');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-hostel-primary" />
          <span className="ml-2">Loading allocation details...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!allocation || !application || !hostel) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle>No Allocation Found</CardTitle>
              <CardDescription>
                You don't have any active hostel allocation.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Hostel Allocation Details</h1>
            <p className="text-muted-foreground">
              Your room has been assigned for academic year {application.academic_year}
            </p>
          </div>
          
          <Card className="mb-8">
            <CardHeader className="bg-hostel-light rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-hostel-primary">{hostel.name}</CardTitle>
                  <CardDescription>Room Number: {allocation.room_number}</CardDescription>
                </div>
                <div className="h-16 w-16 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Home className="h-8 w-8 text-hostel-primary" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">Allotment Date</h3>
                  <p>{format(new Date(allocation.allotment_date), 'MMMM dd, yyyy')}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-1">Payment Status</h3>
                  <div className="flex items-center">
                    {allocation.payment_status === 'COMPLETED' ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-green-600 font-medium">Paid</span>
                      </>
                    ) : (
                      <>
                        <span className="text-yellow-600 font-medium">Pending</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Hostel Facilities</h3>
                <div className="grid grid-cols-2 gap-2">
                  {hostel.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <CheckCircle className="h-3 w-3 text-hostel-primary mr-2" />
                      {facility}
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Important Information</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Please report to the hostel office with your ID proof</li>
                  <li>• Room keys will be provided after verification</li>
                  <li>• Monthly mess charges are separate from hostel fees</li>
                  <li>• Strictly follow the hostel timings and rules</li>
                </ul>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col sm:flex-row gap-4 pt-6">
              {allocation.payment_status === 'PENDING' ? (
                <Button 
                  className="w-full sm:w-auto"
                  onClick={handlePaymentSimulation}
                  disabled={isPaymentLoading}
                >
                  {isPaymentLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pay Hostel Fee (₹{allocation.payment_amount})
                </Button>
              ) : (
                <Button 
                  className="w-full sm:w-auto"
                  variant="outline"
                  onClick={handleDownloadAllotmentLetter}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Allotment Letter
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full sm:w-auto"
                onClick={() => navigate('/dashboard')}
              >
                Return to Dashboard
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hostel Rules</CardTitle>
              <CardDescription>Please ensure you follow all hostel rules and regulations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <h4 className="font-semibold">Entry/Exit Timings</h4>
                <p>Hostel gates close at 10:00 PM. Students must return before closing time.</p>
              </div>
              <div>
                <h4 className="font-semibold">Visitors</h4>
                <p>Visitors are allowed only in designated areas and during visiting hours.</p>
              </div>
              <div>
                <h4 className="font-semibold">Maintenance</h4>
                <p>Students are responsible for keeping their rooms clean and damage-free.</p>
              </div>
              <div>
                <h4 className="font-semibold">Prohibited Items</h4>
                <p>Electrical appliances (except laptop and mobile chargers), cooking equipment, and illegal substances are strictly prohibited.</p>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Violation of hostel rules may result in disciplinary action or expulsion.
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AllocationDetails;
