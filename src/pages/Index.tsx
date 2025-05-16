
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Building, CheckCircle, Clock, User, Shield, FileText, MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
} from "@/components/ui/card";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="md:w-1/2 space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    Hostel Allotment System
                  </h1>
                  <p className="text-lg text-gray-700">
                    A comprehensive platform for students to apply for hostel accommodation 
                    and for administrators to manage room allocations efficiently.
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-hostel-primary hover:bg-orange-600 text-white">
                    <Link to="/register">Register Now</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-hostel-primary text-hostel-primary hover:bg-orange-50">
                    <Link to="/rules">View Hostel Rules</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-orange-50 border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex items-start space-x-4">
                        <User className="h-6 w-6 text-hostel-primary" />
                        <div>
                          <h3 className="font-medium mb-1">Student Portal</h3>
                          <p className="text-sm text-gray-600">Apply for hostel accommodation</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex items-start space-x-4">
                        <Shield className="h-6 w-6 text-blue-500" />
                        <div>
                          <h3 className="font-medium mb-1">Admin Portal</h3>
                          <p className="text-sm text-gray-600">Manage hostel allocation</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex items-start space-x-4">
                        <CheckCircle className="h-6 w-6 text-green-500" />
                        <div>
                          <h3 className="font-medium mb-1">Quick Allocation</h3>
                          <p className="text-sm text-gray-600">Based on availability and score</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6 flex items-start space-x-4">
                        <Clock className="h-6 w-6 text-purple-500" />
                        <div>
                          <h3 className="font-medium mb-1">Real-time Status</h3>
                          <p className="text-sm text-gray-600">Track your application</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl font-bold">Powerful Features</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our system offers comprehensive tools for both students and administrators
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <User className="h-8 w-8 text-hostel-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">User Management</h3>
                <p className="text-center text-gray-600">
                  Separate portals for students and administrators with role-based access control
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <Building className="h-8 w-8 text-hostel-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Room Management</h3>
                <p className="text-center text-gray-600">
                  Configure rooms, track occupancy, and manage allocation efficiently
                </p>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-hostel-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Communication</h3>
                <p className="text-center text-gray-600">
                  Notice board and complaint management system for efficient communication
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Simple and efficient process for hostel allocation
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-white border-t-4 border-t-hostel-primary">
                <CardContent className="p-6 pt-8">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-hostel-primary font-bold text-xl">1</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Register & Apply</h3>
                  <p className="text-gray-600">Create an account, fill out the application form with your details and preferences.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-t-4 border-t-hostel-primary">
                <CardContent className="p-6 pt-8">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-hostel-primary font-bold text-xl">2</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Review Process</h3>
                  <p className="text-gray-600">Administrators review applications and allocate rooms based on availability and priority scores.</p>
                </CardContent>
              </Card>
              
              <Card className="bg-white border-t-4 border-t-hostel-primary">
                <CardContent className="p-6 pt-8">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-hostel-primary font-bold text-xl">3</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Get Allocation</h3>
                  <p className="text-gray-600">Receive your room allocation details and complete the payment process.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Hostel Features Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Hostel Amenities</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our hostels provide comfortable and convenient living spaces for students
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                "Wi-Fi Access", 
                "24/7 Security", 
                "Clean Water Supply", 
                "Mess Facilities",
                "Laundry Service", 
                "Study Rooms", 
                "Recreation Areas", 
                "Power Backup"
              ].map((feature, index) => (
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex items-center">
                    <div className="mr-3 bg-orange-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-hostel-primary" />
                    </div>
                    <span className="font-medium">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Documents & Requirements Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">Required Documents</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Prepare these documents for a smooth application process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Identity Proof",
                  desc: "Valid government-issued photo ID"
                },
                {
                  title: "Address Proof",
                  desc: "Permanent and current address verification"
                },
                {
                  title: "Academic Records",
                  desc: "Latest semester marksheet"
                },
                {
                  title: "Passport Size Photos",
                  desc: "Recent photographs on white background"
                },
                {
                  title: "Income Certificate",
                  desc: "For scholarship and subsidized accommodation"
                },
                {
                  title: "Medical Certificate",
                  desc: "Health and fitness declaration"
                }
              ].map((doc, index) => (
                <Card key={index} className="bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-3">
                      <FileText className="h-5 w-5 mt-0.5 text-hostel-primary" />
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{doc.desc}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-20 px-4 text-white">
          <div className="container mx-auto max-w-6xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Apply for Hostel Accommodation?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create your account now to apply for hostel accommodation and track your application status.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" variant="secondary" className="bg-white text-hostel-primary hover:bg-gray-100">
                <Link to="/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-orange-600">
                <Link to="/rules">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
