
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Application, Student } from '@/types';
import { Link } from 'react-router-dom';
import { AlertCircle, CheckCircle, Download, FileText, Home, Users, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<(Application & { student: Student })[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<(Application & { student: Student })[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    department: 'all',
    gender: 'all'
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    maleCount: 0,
    femaleCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all applications with student details
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            student:student_id (*)
          `)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Transform data to match our expected format
        const transformedData = data.map(item => ({
          ...item,
          student: item.student as Student
        }));

        setApplications(transformedData);
        setFilteredApplications(transformedData);

        // Calculate stats
        const stats = {
          total: transformedData.length,
          pending: transformedData.filter(app => app.status === 'PENDING').length,
          approved: transformedData.filter(app => app.status === 'APPROVED').length,
          rejected: transformedData.filter(app => app.status === 'REJECTED').length,
          maleCount: transformedData.filter(app => app.student?.gender === 'MALE').length,
          femaleCount: transformedData.filter(app => app.student?.gender === 'FEMALE').length
        };

        setStats(stats);
      } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters and search
    const result = applications.filter(app => {
      // Filter by status
      if (filter.status !== 'all' && app.status !== filter.status) {
        return false;
      }

      // Filter by department
      if (filter.department !== 'all' && app.student?.department !== filter.department) {
        return false;
      }

      // Filter by gender
      if (filter.gender !== 'all' && app.student?.gender !== filter.gender) {
        return false;
      }

      // Search by student name or ID
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          app.student?.name.toLowerCase().includes(searchLower) ||
          app.student?.id.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

    setFilteredApplications(result);
  }, [applications, filter, searchTerm]);

  const handleStatusUpdate = async (applicationId: string, status: string, remarks?: string) => {
    try {
      const updateData: any = { status };
      if (remarks) {
        updateData.remarks = remarks;
      }

      const { error } = await supabase
        .from('applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) throw error;

      // Update local state
      const updatedApplications = applications.map(app => 
        app.id === applicationId ? { ...app, status, ...(remarks && { remarks }) } : app
      );
      
      setApplications(updatedApplications);

      // Update stats
      const newStats = {
        total: updatedApplications.length,
        pending: updatedApplications.filter(app => app.status === 'PENDING').length,
        approved: updatedApplications.filter(app => app.status === 'APPROVED').length,
        rejected: updatedApplications.filter(app => app.status === 'REJECTED').length,
        maleCount: updatedApplications.filter(app => app.student?.gender === 'MALE').length,
        femaleCount: updatedApplications.filter(app => app.student?.gender === 'FEMALE').length
      };
      
      setStats(newStats);

      toast.success(`Application status updated to ${status}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update application status');
    }
  };

  const handleApprove = async (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (!application) return;

    // This would normally have a confirmation dialog
    try {
      // First, update application status
      await handleStatusUpdate(applicationId, 'APPROVED');

      // Then create an allocation
      // In a real app, we'd have more sophisticated room selection logic
      const preferredHostelId = application.hostel_preference?.[0];
      if (!preferredHostelId) {
        toast.error('No hostel preference found');
        return;
      }

      // Get a random room number for demo purposes
      const roomNumber = `${Math.floor(Math.random() * 500) + 100}`;
      
      // Get fee amount from settings
      const { data: feeData } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'hostel_fees')
        .single();
        
      const feeAmount = application.category === 'GENERAL' ? 
        feeData.value.general : feeData.value.reserved;

      // Create allocation
      const { error } = await supabase
        .from('allocations')
        .insert({
          application_id: applicationId,
          hostel_id: preferredHostelId,
          room_number: roomNumber,
          payment_status: 'PENDING',
          payment_amount: feeAmount
        });

      if (error) throw error;
      
      toast.success('Room allocated successfully');
    } catch (error) {
      console.error('Error during room allocation:', error);
      toast.error('Failed to allocate room');
    }
  };

  const handleReject = async (applicationId: string) => {
    // In a real app, we'd prompt for rejection reason
    const remarks = "Application does not meet eligibility criteria.";
    await handleStatusUpdate(applicationId, 'REJECTED', remarks);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  const getDepartments = () => {
    const departments = new Set<string>();
    applications.forEach(app => {
      if (app.student?.department) {
        departments.add(app.student.department);
      }
    });
    return Array.from(departments);
  };

  const exportData = () => {
    // In a real app, this would generate a CSV or Excel file
    toast.info('Export feature will be implemented soon');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex items-center justify-center h-64">
            <p>Loading admin dashboard...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <Button onClick={exportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.total}</div>
                <FileText className="h-8 w-8 text-hostel-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.pending}</div>
                <AlertCircle className="h-8 w-8 text-yellow-500" />
              </div>
              <Progress className="mt-2" value={(stats.pending / stats.total) * 100} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.approved}</div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <Progress className="mt-2" value={(stats.approved / stats.total) * 100} />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Gender Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm">Male: {stats.maleCount}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="w-3 h-3 rounded-full bg-pink-500 mr-2"></div>
                    <span className="text-sm">Female: {stats.femaleCount}</span>
                  </div>
                </div>
                <Users className="h-8 w-8 text-hostel-primary" />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Application Management</CardTitle>
            <CardDescription>
              Review and process student hostel applications
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <Input
                placeholder="Search by student name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="md:w-1/3"
              />
              
              <Select 
                value={filter.status} 
                onValueChange={(value) => setFilter({...filter, status: value})}
              >
                <SelectTrigger className="md:w-1/6">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.department} 
                onValueChange={(value) => setFilter({...filter, department: value})}
              >
                <SelectTrigger className="md:w-1/4">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {getDepartments().map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.gender} 
                onValueChange={(value) => setFilter({...filter, gender: value})}
              >
                <SelectTrigger className="md:w-1/6">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Applied On</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApplications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No applications found matching your filters
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <Link to={`/admin/application/${application.id}`} className="hover:underline">
                            {application.student?.name}
                          </Link>
                        </TableCell>
                        <TableCell>{application.student?.department}</TableCell>
                        <TableCell>{application.current_year}</TableCell>
                        <TableCell>{format(new Date(application.created_at), 'MMM dd, yyyy')}</TableCell>
                        <TableCell>{getStatusBadge(application.status)}</TableCell>
                        <TableCell>
                          {application.status === 'PENDING' ? (
                            <div className="flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="border-green-500 hover:bg-green-500 hover:text-white"
                                onClick={() => handleApprove(application.id)}
                              >
                                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="border-red-500 hover:bg-red-500 hover:text-white"
                                onClick={() => handleReject(application.id)}
                              >
                                <XCircle className="h-3.5 w-3.5 mr-1" />
                                Reject
                              </Button>
                            </div>
                          ) : (
                            <Link to={`/admin/application/${application.id}`}>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="hostels" className="mb-6">
          <TabsList>
            <TabsTrigger value="hostels">Hostel Management</TabsTrigger>
            <TabsTrigger value="settings">System Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hostels">
            <Card>
              <CardHeader>
                <CardTitle>Hostel Occupancy</CardTitle>
                <CardDescription>Current status of room availability</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* This would be a dynamic list in a real app */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-hostel-primary" />
                      <div>
                        <p className="font-medium">MH1 - Vivekananda Hostel</p>
                        <p className="text-sm text-muted-foreground">Male Hostel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">120/150 Occupied</p>
                      <Progress value={80} className="mt-1 w-32" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-hostel-primary" />
                      <div>
                        <p className="font-medium">MH2 - Tagore Hostel</p>
                        <p className="text-sm text-muted-foreground">Male Hostel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">85/120 Occupied</p>
                      <Progress value={70} className="mt-1 w-32" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-hostel-primary" />
                      <div>
                        <p className="font-medium">LH1 - Sarojini Hostel</p>
                        <p className="text-sm text-muted-foreground">Female Hostel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">90/100 Occupied</p>
                      <Progress value={90} className="mt-1 w-32" />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Home className="h-5 w-5 mr-2 text-hostel-primary" />
                      <div>
                        <p className="font-medium">LH2 - Kalpana Hostel</p>
                        <p className="text-sm text-muted-foreground">Female Hostel</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">65/80 Occupied</p>
                      <Progress value={81} className="mt-1 w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure application parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Application Period</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Start Date</label>
                        <Input type="date" defaultValue="2025-06-01" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">End Date</label>
                        <Input type="date" defaultValue="2025-06-30" />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Allocation Formula Weights</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <div>
                        <label className="text-sm text-muted-foreground">Income Weight</label>
                        <Input type="number" defaultValue="0.6" min="0" max="1" step="0.1" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Distance Weight</label>
                        <Input type="number" defaultValue="0.4" min="0" max="1" step="0.1" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Weights must sum to 1.0</p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Fee Structure</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-muted-foreground">General Category (₹)</label>
                        <Input type="number" defaultValue="45000" />
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Reserved Category (₹)</label>
                        <Input type="number" defaultValue="25000" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button>Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;
