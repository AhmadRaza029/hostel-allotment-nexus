
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useDashboardData } from '@/hooks/useDashboardData';
import StudentProfileCard from '@/components/dashboard/StudentProfileCard';
import ImportantLinksCard from '@/components/dashboard/ImportantLinksCard';
import ApplicationStatusCard from '@/components/dashboard/ApplicationStatusCard';
import AllocationDetailsCard from '@/components/dashboard/AllocationDetailsCard';
import PaymentAlert from '@/components/dashboard/PaymentAlert';

const Dashboard = () => {
  const { 
    student,
    application, 
    allocation, 
    hostel,
    applicationPeriodActive,
    loading
  } = useDashboardData();

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
            <ApplicationStatusCard 
              application={application} 
              applicationPeriodActive={applicationPeriodActive} 
            />
            
            {application?.status === 'APPROVED' && allocation && (
              <AllocationDetailsCard 
                allocation={allocation}
                hostel={hostel}
              />
            )}
          </div>
          
          <div className="space-y-6">
            <StudentProfileCard student={student} />
            
            <ImportantLinksCard 
              application={application}
              allocation={allocation}
              applicationPeriodActive={applicationPeriodActive}
            />
            
            {application?.status === 'APPROVED' && allocation && (
              <PaymentAlert allocation={allocation} />
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
