
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Building, CheckCircle, Clock, User } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-orange-50 to-white py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Hostel Allotment System
                </h1>
                <p className="text-lg text-gray-700">
                  A comprehensive platform for students to apply for hostel accommodation 
                  and for administrators to manage room allocations efficiently.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600">
                    <Link to="/register">Register</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/rules">View Allotment Rules</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-orange-50 p-4 rounded-xl flex items-start space-x-4">
                      <User className="h-6 w-6 text-orange-500" />
                      <div>
                        <h3 className="font-medium">Student Portal</h3>
                        <p className="text-sm text-gray-600">Apply for hostel accommodation</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-xl flex items-start space-x-4">
                      <Building className="h-6 w-6 text-blue-500" />
                      <div>
                        <h3 className="font-medium">Admin Portal</h3>
                        <p className="text-sm text-gray-600">Manage hostel allocation</p>
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-xl flex items-start space-x-4">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                      <div>
                        <h3 className="font-medium">Quick Allocation</h3>
                        <p className="text-sm text-gray-600">Based on availability and score</p>
                      </div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-xl flex items-start space-x-4">
                      <Clock className="h-6 w-6 text-purple-500" />
                      <div>
                        <h3 className="font-medium">Real-time Status</h3>
                        <p className="text-sm text-gray-600">Track your application</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* How it Works Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Register & Apply</h3>
                <p className="text-gray-600">Create an account, fill out the application form with your details and preferences.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Review Process</h3>
                <p className="text-gray-600">Administrators review applications and allocate rooms based on availability and priority scores.</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <span className="text-orange-500 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3">Get Allocation</h3>
                <p className="text-gray-600">Receive your room allocation details and complete the payment process.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Hostel Features Section */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold text-center mb-12">Hostel Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div key={index} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                  <div className="flex items-center">
                    <div className="mr-3 bg-orange-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-orange-500" />
                    </div>
                    <span>{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-orange-500 py-16 px-4 text-white">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Apply for Hostel Accommodation?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Create your account now to apply for hostel accommodation and track your application status.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button asChild size="lg" variant="secondary" className="bg-white text-orange-500 hover:bg-gray-100">
                <Link to="/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-orange-600">
                <Link to="/">
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
