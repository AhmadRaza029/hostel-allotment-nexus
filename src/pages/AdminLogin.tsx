
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Link } from 'react-router-dom';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password, 'admin');
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Administrator Login</h1>
            <p className="text-muted-foreground">
              Welcome back! Enter your admin credentials to manage hostel services.
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Administrator Login</CardTitle>
              <CardDescription>
                Enter your admin credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {showForgotPassword ? (
                <ForgotPasswordForm onCancel={() => setShowForgotPassword(false)} />
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Administrator email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Your password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="button" 
                      variant="link" 
                      className="p-0 h-auto text-sm"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </Button>
                    
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isLoading}>
                      {isLoading ? "Logging in..." : "Login as Administrator"}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-2">
              <div className="text-sm text-muted-foreground text-center w-full">
                Are you a student?{" "}
                <Link to="/" className="text-primary hover:underline">
                  Login here
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
