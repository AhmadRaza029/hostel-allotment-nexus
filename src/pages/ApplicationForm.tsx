
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Hostel, Student } from '@/types';
import { AlertCircle, Loader2, UploadCloud } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const currentYear = new Date().getFullYear();
const academicYear = `${currentYear}-${currentYear + 1}`;

const applicationSchema = z.object({
  academic_year: z.string().default(academicYear),
  current_year: z.coerce.number().int().min(1).max(5),
  cgpa: z.coerce.number().min(0).max(10).optional(),
  home_address: z.string().min(5, "Address is required"),
  distance_km: z.coerce.number().int().optional(),
  annual_income: z.coerce.number().min(0).optional(),
  category: z.string().optional(),
  hostel_preference: z.array(z.string()).min(1, "Select at least one hostel preference"),
  terms_accepted: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms and conditions" }),
  }),
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [photoIdFile, setPhotoIdFile] = useState<File | null>(null);
  const [incomeCertFile, setIncomeCertFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingApplication, setExistingApplication] = useState(false);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      academic_year: academicYear,
      current_year: 1,
      cgpa: undefined,
      home_address: "",
      distance_km: undefined,
      annual_income: undefined,
      category: "",
      hostel_preference: [],
      terms_accepted: false,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch student profile
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('*')
            .eq('id', user.id)
            .single();

          if (studentError) throw studentError;
          setStudent(studentData);

          // Check if student already has an application
          const { data: appData, error: appError } = await supabase
            .from('applications')
            .select('*')
            .eq('student_id', user.id)
            .eq('academic_year', academicYear)
            .single();

          if (appData) {
            setExistingApplication(true);
          }

          if (appError && appError.code !== 'PGRST116') {
            // PGRST116 is "no rows returned" which is expected if there's no application
            throw appError;
          }

          // Fetch available hostels based on student gender
          if (studentData) {
            const { data: hostelsData, error: hostelsError } = await supabase
              .from('hostels')
              .select('*')
              .eq('gender', studentData.gender);

            if (hostelsError) throw hostelsError;
            setHostels(hostelsData || []);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load necessary data');
        }
      }
    };

    fetchData();
  }, [user]);

  const handleFileUpload = async (file: File, path: string) => {
    if (!file || !user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hostel-documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('hostel-documents')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      throw new Error(`Error uploading ${path}: ${error.message}`);
    }
  };

  const onSubmit = async (data: ApplicationFormValues) => {
    if (!user || !student) {
      toast.error('User information not available');
      return;
    }

    setIsSubmitting(true);
    setIsUploading(true);

    try {
      // Upload documents
      let photoIdUrl = null;
      let incomeCertUrl = null;

      if (photoIdFile) {
        photoIdUrl = await handleFileUpload(photoIdFile, 'id-proof');
      }

      if (incomeCertFile) {
        incomeCertUrl = await handleFileUpload(incomeCertFile, 'income-cert');
      }

      setIsUploading(false);

      // Submit application
      const applicationData = {
        student_id: user.id,
        academic_year: data.academic_year,
        current_year: data.current_year,
        cgpa: data.cgpa,
        home_address: data.home_address,
        distance_km: data.distance_km,
        annual_income: data.annual_income,
        category: data.category,
        photo_id_url: photoIdUrl,
        income_cert_url: incomeCertUrl,
        hostel_preference: data.hostel_preference,
        status: 'PENDING'
      };

      const { error } = await supabase
        .from('applications')
        .insert(applicationData);

      if (error) throw error;

      toast.success('Application submitted successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(`Failed to submit application: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  if (existingApplication) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-12 flex-1">
          <Alert variant="destructive" className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application Already Submitted</AlertTitle>
            <AlertDescription>
              You have already submitted an application for the current academic year.
              You can check its status on your dashboard.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-center mt-6">
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Return to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Hostel Application Form</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Academic Year {academicYear}</CardTitle>
              <CardDescription>
                Fill out this form carefully to apply for hostel accommodation
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="current_year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Year of Study</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))} 
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">First Year</SelectItem>
                              <SelectItem value="2">Second Year</SelectItem>
                              <SelectItem value="3">Third Year</SelectItem>
                              <SelectItem value="4">Fourth Year</SelectItem>
                              <SelectItem value="5">Fifth Year/Masters</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="cgpa"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>CGPA (if applicable)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="Enter your CGPA" {...field} 
                              value={field.value === undefined ? '' : field.value}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>Leave blank if you're a first-year student</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6">
                    <FormField
                      control={form.control}
                      name="home_address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Home Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter your permanent home address" 
                              className="resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="distance_km"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance from Home (km)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Distance in kilometers" 
                              {...field} 
                              value={field.value === undefined ? '' : field.value}
                              onChange={(e) => {
                                const value = e.target.value ? parseInt(e.target.value) : undefined;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormDescription>Approximate distance from home to campus</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="annual_income"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Family Income</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Annual income in rupees" 
                              {...field} 
                              value={field.value === undefined ? '' : field.value}
                              onChange={(e) => {
                                const value = e.target.value ? parseFloat(e.target.value) : undefined;
                                field.onChange(value);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GENERAL">General</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="ST">ST</SelectItem>
                            <SelectItem value="PWD">Persons with Disability</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel>Photo ID Proof</FormLabel>
                      <div className="border-2 border-dashed rounded-lg p-6 mt-1 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => document.getElementById('photo-id-upload')?.click()}>
                        <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {photoIdFile ? photoIdFile.name : 'Click to upload ID proof'}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF or JPG (max 5MB)</p>
                        <input 
                          id="photo-id-upload" 
                          type="file" 
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPhotoIdFile(e.target.files[0]);
                            }
                          }} 
                        />
                      </div>
                    </div>
                    
                    <div>
                      <FormLabel>Income Certificate</FormLabel>
                      <div className="border-2 border-dashed rounded-lg p-6 mt-1 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => document.getElementById('income-cert-upload')?.click()}>
                        <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground mb-1">
                          {incomeCertFile ? incomeCertFile.name : 'Click to upload income certificate'}
                        </p>
                        <p className="text-xs text-muted-foreground">PDF or JPG (max 5MB)</p>
                        <input 
                          id="income-cert-upload" 
                          type="file" 
                          className="hidden" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setIncomeCertFile(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="hostel_preference"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Hostel Preference</FormLabel>
                          <FormDescription>Select your preferred hostels in order</FormDescription>
                        </div>
                        
                        <div className="space-y-2">
                          {hostels.map((hostel) => (
                            <FormField
                              key={hostel.id}
                              control={form.control}
                              name="hostel_preference"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={hostel.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(hostel.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedPreferences = checked
                                            ? [...field.value, hostel.id]
                                            : field.value?.filter((id) => id !== hostel.id);
                                          field.onChange(updatedPreferences);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {hostel.name}
                                      <p className="text-xs text-muted-foreground">
                                        Available Rooms: {hostel.available_rooms}, 
                                        Facilities: {hostel.facilities.join(', ')}
                                      </p>
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="terms_accepted"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the hostel rules and regulations
                          </FormLabel>
                          <FormDescription>
                            By checking this box, I confirm that all information provided is accurate.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => navigate('/dashboard')}
                      disabled={isSubmitting || isUploading}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isSubmitting || isUploading}
                    >
                      {(isSubmitting || isUploading) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {isUploading ? 'Uploading Documents...' : 
                       isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            
            <CardFooter className="flex justify-between text-xs text-muted-foreground">
              <p>All fields marked with * are mandatory</p>
              <p>Need help? Contact hostel administration</p>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationForm;
