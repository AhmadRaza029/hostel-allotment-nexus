
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Application, Allocation, Student, Hostel } from '@/types';

interface DashboardData {
  student: Student | null;
  application: Application | null;
  allocation: Allocation | null;
  hostel: Hostel | null;
  pendingFees: number;
  applicationPeriodActive: boolean;
  loading: boolean;
}

export const useDashboardData = (): DashboardData => {
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
          // Cast the status to the appropriate type
          setApplication({
            ...appData[0],
            status: appData[0].status as "PENDING" | "APPROVED" | "REJECTED"
          });
          
          // If application is approved, fetch allocation
          if (appData[0].status === 'APPROVED') {
            const { data: allocData, error: allocError } = await supabase
              .from('allocations')
              .select('*')
              .eq('application_id', appData[0].id)
              .single();
              
            if (!allocError && allocData) {
              // Cast the payment_status to the appropriate type
              setAllocation({
                ...allocData,
                payment_status: allocData.payment_status as "PENDING" | "COMPLETED" | "FAILED"
              });
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

  return {
    student,
    application,
    allocation,
    hostel,
    pendingFees,
    applicationPeriodActive,
    loading
  };
};
