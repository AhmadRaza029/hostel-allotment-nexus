import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertCircle, BookOpen, Loader2, MapPin, Upload } from 'lucide-react';
import { Hostel, Student } from '@/types';

const formSchema = z.object({
  academicYear: z.string().min(4, "Please select an academic year"),
  currentYear: z.string().min(1, "Please select your current year"),
  cgpa: z.string().optional(),
  homeAddress: z.string().min(5, "Please enter your complete home address"),
  distanceKm: z.string().optional(),
  annualIncome: z.string().optional(),
  category: z.string().optional(),
  hostelPreferences: z.array(z.string()).optional(),
  confirmRules: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the hostel rules" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ApplicationForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [hasExistingApplication, setHasExistingApplication] = useState(false);
  const [applicationPeriodOpen, setApplicationPeriodOpen] = useState(true);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      academicYear: "2025-2026",
      currentYear: "",
      cgpa: "",
      homeAddress: "",
      distanceKm: "",
      annualIncome: "",
      category: "",
      hostelPreferences: [],
      confirmRules: false as unknown as true,  // TypeScript hack since we'll validate this to be true
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

          // Check for existing applications
          const { data: applicationData, error: applicationError } = await supabase
            .from('applications')
            .select('*')
            .eq('student_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1);

          if (applicationError) throw applicationError;
          
          if (applicationData && applicationData.length > 0) {
            setHasExistingApplication(true);
            
            if (applicationData[0].status !== 'REJECTED') {
              toast.info("You already have an application in process");
              navigate('/dashboard');
              return;
            }
          }

          // Fetch hostels matching student gender
          const { data: hostelData, error: hostelError } = await supabase
            .from('hostels')
            .select('*')
            .eq('gender', studentData.gender);

          if (hostelError) throw hostelError;
          setHostels(hostelData);

          // Check application period
          const { data: settingsData, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .eq('key', 'application_dates')
            .single();

          if (settingsError) throw settingsError;

          if (settingsData) {
            const value = settingsData.value as { start: string, end: string };
            const startDate = new Date(value.start);
            const endDate = new Date(value.end);
            const now = new Date();
            
            setApplicationPeriodOpen(now >= startDate && now <= endDate);
          }

        } catch (error) {
          console.error('Error fetching data:', error);
          toast.error('Failed to load required data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user, navigate]);

  const onSubmit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      const { academicYear, currentYear, cgpa, homeAddress, distanceKm, annualIncome, category, hostelPreferences } = values;

      const { data, error } = await supabase
        .from('applications')
        .insert([
          {
            student_id: user.id,
            academic_year: academicYear,
            current_year: parseInt(currentYear),
            cgpa: cgpa ? parseFloat(cgpa) : null,
            home_address: homeAddress,
            distance_km: distanceKm ? parseFloat(distanceKm) : null,
            annual_income: annualIncome ? parseInt(annualIncome) : null,
            category: category || null,
            hostel_preference: hostelPreferences,
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
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-hostel-primary mr-2" />
          <span>Loading application form...</span>
        </div>
        <Footer />
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Student profile not found. Please contact support.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  if (!applicationPeriodOpen) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Application period is closed</AlertTitle>
            <AlertDescription>
              The application window is currently closed. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Hostel Application Form</h1>
            <p className="text-muted-foreground">
              Fill in the details below to apply for hostel accommodation.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Please provide accurate details for your application.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="2024-2025">2024-2025</SelectItem>
                              <SelectItem value="2025-2026">2025-2026</SelectItem>
                              <SelectItem value="2026-2027">2026-2027</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="currentYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Year of Study</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1">First Year</SelectItem>
                              <SelectItem value="2">Second Year</SelectItem>
                              <SelectItem value="3">Third Year</SelectItem>
                              <SelectItem value="4">Fourth Year</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="cgpa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CGPA (if applicable)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your CGPA" {...field} />
                        </FormControl>
                        <FormDescription>
                          If you don't have a CGPA, you can leave this field blank.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="homeAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Home Address</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter your complete home address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="distanceKm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Distance from Campus (in KM)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter distance in kilometers" type="number" {...field} />
                          </FormControl>
                          <FormDescription>
                            Approximate distance between your home and the campus.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="annualIncome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Annual Family Income (₹)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter annual family income" type="number" {...field} />
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
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="GENERAL">General</SelectItem>
                            <SelectItem value="OBC">OBC</SelectItem>
                            <SelectItem value="SC">SC</SelectItem>
                            <SelectItem value="ST">ST</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel className="mb-2">Hostel Preferences</FormLabel>
                    <FormDescription>
                      Select up to three hostels based on your preference.
                    </FormDescription>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {hostels.map((hostel) => (
                        <FormField
                          key={hostel.id}
                          control={form.control}
                          name="hostelPreferences"
                          render={({ field }) => {
                            return (
                              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(hostel.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value || [], hostel.id])
                                        : field.onChange(field.value?.filter((value) => value !== hostel.id));
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {hostel.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="confirmRules"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox 
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-tight">
                          <FormLabel className="text-base font-semibold">
                            I agree to abide by all hostel rules and regulations.
                          </FormLabel>
                          <FormDescription>
                            <Link to="/rules" className="text-hostel-primary hover:underline">
                              View Hostel Rules
                            </Link>
                          </FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Submit Application
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ApplicationForm;
