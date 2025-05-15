
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useApplicationDetail } from '@/hooks/useApplicationDetail';
import ApplicationLoadingState from '@/components/admin/ApplicationLoadingState';
import ApplicationNotFound from '@/components/admin/ApplicationNotFound';
import ApplicationHeaderCard from '@/components/admin/ApplicationHeaderCard';
import StudentInformationCard from '@/components/admin/StudentInformationCard';
import ApplicationDocumentsCard from '@/components/admin/ApplicationDocumentsCard';
import HostelPreferencesCard from '@/components/admin/HostelPreferencesCard';
import StudentContactCard from '@/components/admin/StudentContactCard';
import ApplicationActionCard from '@/components/admin/ApplicationActionCard';

const AdminApplicationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { application, student, loading, handleApplicationProcessed } = useApplicationDetail(id);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <ApplicationLoadingState />
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
          <ApplicationNotFound />
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
            <ApplicationHeaderCard application={application} />
            <StudentInformationCard student={student} application={application} />
            <ApplicationDocumentsCard application={application} />
            <HostelPreferencesCard application={application} />
          </div>
          
          <div className="space-y-6">
            {/* Application Action Card */}
            <ApplicationActionCard 
              application={application} 
              onApplicationProcessed={handleApplicationProcessed} 
            />
            
            {/* Student Contact Card */}
            <StudentContactCard student={student} />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminApplicationDetail;
