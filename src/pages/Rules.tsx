
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AlertTriangle, BookOpen, Calendar, Clock, FileWarning, Home, ShieldAlert, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const Rules = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold mb-2">Hostel Rules & Regulations</h1>
            <p className="text-muted-foreground">
              All students are expected to abide by these rules during their stay
            </p>
          </div>
          
          <Tabs defaultValue="general">
            <div className="mb-6">
              <TabsList className="w-full grid grid-cols-1 md:grid-cols-4">
                <TabsTrigger value="general">General Rules</TabsTrigger>
                <TabsTrigger value="discipline">Discipline</TabsTrigger>
                <TabsTrigger value="rooms">Room Guidelines</TabsTrigger>
                <TabsTrigger value="mess">Mess Rules</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="general">
              <Card className="mb-6">
                <CardHeader className="bg-hostel-light rounded-t-lg pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="h-6 w-6 text-hostel-primary" />
                    <CardTitle>General Rules & Regulations</CardTitle>
                  </div>
                  <CardDescription>
                    Fundamental rules that apply to all hostel residents
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-hostel-primary" />
                        Hostel Timings
                      </h3>
                      <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                        <li>Hostel gates close at 10:00 PM for all students.</li>
                        <li>Students must return to the hostels before the gate closing time.</li>
                        <li>Late entry is only allowed with prior permission from the warden.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Home className="h-4 w-4 mr-2 text-hostel-primary" />
                        Accommodation
                      </h3>
                      <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                        <li>Rooms are allotted for one academic year only.</li>
                        <li>Students cannot change rooms without prior permission from the hostel warden.</li>
                        <li>Room furniture cannot be moved without permission.</li>
                        <li>Students are responsible for the safety of their belongings.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Users className="h-4 w-4 mr-2 text-hostel-primary" />
                        Visitors
                      </h3>
                      <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                        <li>Visitors are allowed only in the visitor's area between 4:00 PM and 8:00 PM.</li>
                        <li>No visitors are allowed inside the hostel rooms.</li>
                        <li>All visitors must sign the visitor's register and provide valid ID.</li>
                        <li>Overnight stays by guests are strictly prohibited.</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-hostel-primary" />
                        Leave Rules
                      </h3>
                      <ul className="list-disc list-inside space-y-1 mt-2 ml-6">
                        <li>Students planning to leave the hostel for more than 24 hours must obtain permission.</li>
                        <li>Leave application must be submitted at least one day in advance.</li>
                        <li>In case of emergency, students must inform the warden via phone.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="text-sm text-muted-foreground border-t pt-4">
                  These rules are subject to change. Any modifications will be communicated to all residents.
                </CardFooter>
              </Card>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Important Notice</AlertTitle>
                <AlertDescription>
                  Violation of hostel rules may result in disciplinary action, including but not limited to fines, 
                  suspension of hostel privileges, or expulsion from the hostel.
                </AlertDescription>
              </Alert>
            </TabsContent>
            
            <TabsContent value="discipline">
              <Card>
                <CardHeader className="bg-hostel-light rounded-t-lg pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldAlert className="h-6 w-6 text-hostel-primary" />
                    <CardTitle>Discipline & Conduct</CardTitle>
                  </div>
                  <CardDescription>
                    Expected behavior and disciplinary guidelines for all residents
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="font-semibold mb-2">General Conduct</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Students must maintain decorum and behave in a dignified manner.</li>
                      <li>Creating nuisance, shouting, or playing loud music is strictly prohibited.</li>
                      <li>Students must respect all hostel staff and follow their instructions.</li>
                      <li>Dress code must be decent in common areas of the hostel.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Prohibited Activities</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Consumption of alcohol, tobacco, or other intoxicating substances is strictly prohibited.</li>
                      <li>Gambling in any form is not allowed within the hostel premises.</li>
                      <li>Ragging in any form is a punishable offense as per UGC regulations.</li>
                      <li>Keeping firearms, weapons, or inflammable materials is strictly prohibited.</li>
                      <li>Cooking is not allowed in the hostel rooms.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Anti-Ragging Policy</h3>
                    <p className="mb-2">
                      Ragging in any form is strictly prohibited and is a punishable offense as per UGC regulations and Supreme Court directives.
                    </p>
                    <Alert variant="destructive" className="mt-2">
                      <FileWarning className="h-4 w-4" />
                      <AlertTitle>Zero Tolerance</AlertTitle>
                      <AlertDescription>
                        Any student found guilty of ragging will face immediate expulsion from the hostel and institution, 
                        along with legal action as per prevailing laws.
                      </AlertDescription>
                    </Alert>
                    <p className="mt-4 text-sm">
                      Students can report ragging incidents to the Anti-Ragging Committee, Hostel Warden, 
                      or call the National Anti-Ragging Helpline: <strong>1800-180-5522</strong>
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Disciplinary Actions</h3>
                    <p className="mb-2">The following actions may be taken against violations of hostel rules:</p>
                    <ol className="list-decimal list-inside space-y-1 ml-6">
                      <li>Verbal warning for minor first-time offenses</li>
                      <li>Written warning with information to parents/guardians</li>
                      <li>Monetary fine depending on the severity of the offense</li>
                      <li>Suspension from the hostel for a specified period</li>
                      <li>Expulsion from the hostel in case of serious violations</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="rooms">
              <Card>
                <CardHeader className="bg-hostel-light rounded-t-lg pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Home className="h-6 w-6 text-hostel-primary" />
                    <CardTitle>Room Guidelines</CardTitle>
                  </div>
                  <CardDescription>
                    Rules for maintenance and usage of hostel rooms
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Room Allotment</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Room allotment is done at the beginning of each academic year.</li>
                      <li>Students cannot change rooms without prior permission from the warden.</li>
                      <li>The administration reserves the right to relocate students if required.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Room Maintenance</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Students are responsible for keeping their rooms clean and tidy.</li>
                      <li>Rooms will be inspected periodically by the hostel administration.</li>
                      <li>Walls must not be defaced by posters, nails, or adhesive materials.</li>
                      <li>Room furniture cannot be moved or exchanged without permission.</li>
                      <li>Any damage to room property will be charged to the occupant(s).</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Electrical Appliances</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Use of electrical appliances such as heaters, irons, and hot plates is prohibited.</li>
                      <li>Laptop and mobile chargers are permitted.</li>
                      <li>Students should switch off lights and fans when leaving the room.</li>
                      <li>Any electrical issue must be reported to the hostel office immediately.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Room Checkout Procedure</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Students must vacate their rooms within 3 days after the end of the academic year.</li>
                      <li>A formal room check-out process must be followed.</li>
                      <li>Room keys must be returned to the warden.</li>
                      <li>All personal belongings must be taken or properly disposed of.</li>
                      <li>Any damage cost will be deducted from the caution deposit.</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mess">
              <Card>
                <CardHeader className="bg-hostel-light rounded-t-lg pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="h-6 w-6 text-hostel-primary" />
                    <CardTitle>Mess Rules</CardTitle>
                  </div>
                  <CardDescription>
                    Guidelines for dining and mess facilities
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="font-semibold mb-2">Mess Timings</h3>
                    <div className="grid grid-cols-2 gap-4 ml-6">
                      <div>
                        <p className="text-sm text-muted-foreground">Breakfast</p>
                        <p>7:00 AM - 9:00 AM</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Lunch</p>
                        <p>12:00 PM - 2:00 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Snacks</p>
                        <p>4:30 PM - 5:30 PM</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Dinner</p>
                        <p>7:30 PM - 9:30 PM</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Mess Guidelines</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Mess fees must be paid in advance as per the payment schedule.</li>
                      <li>Students must carry their ID cards to the dining hall.</li>
                      <li>Food will only be served during the specified timings.</li>
                      <li>Proper queue must be maintained while collecting food.</li>
                      <li>Wastage of food is strictly prohibited.</li>
                      <li>Proper dining etiquette must be observed in the mess.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Mess Rebate</h3>
                    <ul className="list-disc list-inside space-y-1 ml-6">
                      <li>Students are eligible for mess rebate only during official vacation periods.</li>
                      <li>Mess rebate forms must be submitted at least 3 days in advance.</li>
                      <li>Minimum period for mess rebate is 5 consecutive days.</li>
                      <li>Maximum rebate allowed is 15 days per semester.</li>
                      <li>No mess rebate will be given during the first and last week of each semester.</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Special Diet</h3>
                    <p className="ml-6">
                      Students requiring special diets due to medical conditions must submit a request along with a medical certificate.
                      The mess committee will make necessary arrangements based on the availability of resources.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Rules;
