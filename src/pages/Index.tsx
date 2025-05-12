
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import InfoCard from '@/components/InfoCard';
import Footer from '@/components/Footer';
import { Book, Home, Bed, ArrowRight } from 'lucide-react';

const Index = () => {
  const handleLoginClick = (type: 'student' | 'admin') => {
    console.log(`${type} login clicked`);
    // Future navigation logic would go here
  };

  const infoCards = [
    {
      title: "Hostel Rules",
      icon: Book,
      onClick: () => console.log("Hostel rules clicked")
    },
    {
      title: "Accommodation Details",
      icon: Bed,
      onClick: () => console.log("Accommodation details clicked")
    },
    {
      title: "Facilities",
      icon: Home,
      onClick: () => console.log("Facilities clicked")
    },
    {
      title: "Anti-Ragging",
      icon: Book,
      onClick: () => console.log("Anti-ragging clicked")
    },
    {
      title: "Authorities",
      icon: Book,
      onClick: () => console.log("Authorities clicked")
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative bg-hostel-hero bg-cover bg-center h-screen pt-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-b from-hostel-dark/70 to-hostel-dark/90"></div>
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-hostel-primary">
              Hostel Allotment System
            </h1>
            <h2 className="text-xl md:text-2xl mb-8 text-hostel-secondary">
              Maulana Abul Kalam Azad University of Technology
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
              <Button 
                size="lg" 
                className="bg-hostel-primary hover:bg-hostel-primary/90 text-white"
                onClick={() => handleLoginClick('student')}
              >
                Student Login <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={() => handleLoginClick('admin')}
              >
                Admin Login <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {infoCards.map((card, index) => (
                <InfoCard
                  key={index}
                  title={card.title}
                  icon={card.icon}
                  onClick={card.onClick}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8 text-hostel-dark">About Our Hostel</h2>
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-600 mb-4">
                  Our university hostels provide comfortable and secure accommodation for students, 
                  with modern facilities and a conducive environment for academic pursuits. We offer 
                  separate hostels for male and female students with all necessary amenities.
                </p>
                <p className="text-gray-600">
                  The Hostel Allotment System streamlines the process of applying for and securing 
                  hostel accommodation. Students can easily apply online, track their application status, 
                  and receive allotment letters digitally.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-hostel-dark">Hostel Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-fade-in">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-hostel-light text-hostel-primary mb-4">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-hostel-dark">Modern Facilities</h3>
                <p className="text-gray-600">
                  Fully furnished rooms, high-speed Wi-Fi, study areas, and recreational zones for a comfortable stay.
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in delay-100">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-hostel-light text-hostel-primary mb-4">
                  <Bed className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-hostel-dark">Comfortable Rooms</h3>
                <p className="text-gray-600">
                  Well-designed rooms with proper ventilation, quality beds, and adequate storage space.
                </p>
              </CardContent>
            </Card>
            
            <Card className="animate-fade-in delay-200">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="p-4 rounded-full bg-hostel-light text-hostel-primary mb-4">
                  <Book className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-hostel-dark">Supportive Environment</h3>
                <p className="text-gray-600">
                  Wardens and staff available 24/7 to assist students with their needs and ensure safety.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
