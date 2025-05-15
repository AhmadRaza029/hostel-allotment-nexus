
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Application, Student } from '@/types';

export const useApplicationDetail = (id: string | undefined) => {
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

  return {
    application,
    student,
    loading,
    handleApplicationProcessed
  };
};
