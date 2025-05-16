
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Info } from 'lucide-react';

const Rules = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Hostel Allocation Rules & Policies</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
              <CardDescription>Requirements to apply for hostel accommodation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Info className="h-4 w-4 text-orange-500" />
                </div>
                <p>Must be a registered full-time student of the university.</p>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Info className="h-4 w-4 text-orange-500" />
                </div>
                <p>Students whose permanent residence is more than 25 km away from the university will be given priority.</p>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Info className="h-4 w-4 text-orange-500" />
                </div>
                <p>Students must maintain a minimum CGPA of 6.0 to be eligible for hostel accommodation.</p>
              </div>
              <Separator />
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full">
                  <Info className="h-4 w-4 text-orange-500" />
                </div>
                <p>Students with disciplinary actions against them may be denied hostel accommodation.</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Allocation Process</CardTitle>
              <CardDescription>How rooms are allocated to eligible students</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-medium">Socio-Geographic Scoring System</h3>
              <p>Hostel rooms are allocated based on a scoring system that considers the following factors:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Distance from permanent residence to university (30%)</li>
                <li>Family income level (30%)</li>
                <li>Academic performance/CGPA (20%)</li>
                <li>Student year/seniority (10%)</li>
                <li>Extracurricular activities and contribution to university (10%)</li>
              </ul>
              
              <h3 className="font-medium mt-6">Allocation Timeline</h3>
              <ol className="list-decimal list-inside ml-4 space-y-2">
                <li>Applications open: 4 weeks before semester starts</li>
                <li>Application deadline: 2 weeks before semester starts</li>
                <li>Allocation results: 1 week before semester starts</li>
                <li>Room check-in: 3 days before semester starts</li>
              </ol>
            </CardContent>
          </Card>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Room Types & Facilities</CardTitle>
              <CardDescription>Different types of accommodation available</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border p-2 text-left">Room Type</th>
                      <th className="border p-2 text-left">Capacity</th>
                      <th className="border p-2 text-left">Facilities</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border p-2">Standard Room</td>
                      <td className="border p-2">2-3 Students</td>
                      <td className="border p-2">Bed, Study table, Chair, Wardrobe, Common bathroom</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Semi-Private Room</td>
                      <td className="border p-2">1-2 Students</td>
                      <td className="border p-2">Bed, Study table, Chair, Wardrobe, Attached bathroom</td>
                    </tr>
                    <tr>
                      <td className="border p-2">Single Room</td>
                      <td className="border p-2">1 Student</td>
                      <td className="border p-2">Bed, Study table, Chair, Wardrobe, Attached bathroom, AC</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Hostel Rules & Regulations</CardTitle>
              <CardDescription>Rules to be followed by all hostel residents</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Hostel fees must be paid within the specified deadline.</li>
                <li>Visitors are only allowed in common areas during visiting hours.</li>
                <li>Strict adherence to hostel timings is mandatory.</li>
                <li>Consumption of alcohol, tobacco, and drugs is strictly prohibited.</li>
                <li>Students are responsible for keeping their rooms and common areas clean.</li>
                <li>Damage to hostel property will result in fines and disciplinary action.</li>
                <li>Electric appliances (except laptops, mobile phones, etc.) are not allowed without permission.</li>
                <li>Ragging in any form is strictly prohibited and will result in immediate expulsion.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rules;
