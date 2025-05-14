
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ApplicationFormValues, applicationFormSchema } from '@/components/application-form/ApplicationFormSchema';

export const useApplicationForm = (userId: string) => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [incomeCertFile, setIncomeCertFile] = useState<File | null>(null);
  const [paymentSlipFile, setPaymentSlipFile] = useState<File | null>(null);
  
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      academicYear: "2025-2026",
      currentYear: "",
      cgpa: "",
      homeAddress: "",
      distanceKm: "",
      annualIncome: "",
      category: "",
      hostelPreferences: [],
      confirmRules: false as unknown as true,
    },
  });

  // Upload file to Supabase storage
  const uploadFile = async (file: File, path: string) => {
    try {
      if (!userId) throw new Error('User not authenticated');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${path}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('hostel-documents')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      return filePath;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };

  // Handle document file input changes
  const handlePhotoIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoIdFile(e.target.files[0]);
    }
  };
  
  const handleIncomeCertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIncomeCertFile(e.target.files[0]);
    }
  };
  
  const handlePaymentSlipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentSlipFile(e.target.files[0]);
    }
  };

  // Form submission handler
  const onSubmit = async (values: ApplicationFormValues) => {
    setSubmitting(true);
    setUploading(true);
    
    try {
      if (!userId) throw new Error('User not authenticated');
      
      const { academicYear, currentYear, cgpa, homeAddress, distanceKm, annualIncome, category, hostelPreferences } = values;
      
      // Upload files if provided
      let photoIdUrl: string | null = null;
      let incomeCertUrl: string | null = null;
      let paymentReceiptUrl: string | null = null;
      
      if (photoIdFile) {
        photoIdUrl = await uploadFile(photoIdFile, 'photo_id');
      }
      
      if (incomeCertFile) {
        incomeCertUrl = await uploadFile(incomeCertFile, 'income_cert');
      }
      
      if (paymentSlipFile) {
        paymentReceiptUrl = await uploadFile(paymentSlipFile, 'payment_slip');
      }
      
      // Create application record
      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            student_id: userId,
            academic_year: academicYear,
            current_year: parseInt(currentYear),
            cgpa: cgpa ? parseFloat(cgpa) : null,
            home_address: homeAddress,
            distance_km: distanceKm ? parseFloat(distanceKm) : null,
            annual_income: annualIncome ? parseInt(annualIncome) : null,
            category: category || null,
            hostel_preference: hostelPreferences,
            photo_id_url: photoIdUrl,
            income_cert_url: incomeCertUrl,
            payment_slip_url: paymentReceiptUrl,
            status: 'PENDING',
          },
        ])
        .select();

      if (error) {
        throw error;
      }

      toast.success("Application submitted successfully!");
      navigate('/dashboard');
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  return {
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
  };
};
