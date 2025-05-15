
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student, Application } from '@/types';
import { Separator } from '@/components/ui/separator';

interface StudentInformationCardProps {
  student: Student;
  application: Application;
}

const StudentInformationCard = ({ student, application }: StudentInformationCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Student Information</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Student Information section */}
          <div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Student ID</p>
                <p className="font-medium">{student.id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{student.department}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Year</p>
                <p className="font-medium">{application.current_year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{student.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{student.phone || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gender</p>
                <p className="font-medium">{student.gender}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="font-medium">{application.category || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Application Details section */}
          <div>
            <h3 className="text-lg font-medium">Application Details</h3>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-medium">{application.academic_year}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">CGPA</p>
                <p className="font-medium">{application.cgpa || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Home Address</p>
                <p className="font-medium">{application.home_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Distance from Campus</p>
                <p className="font-medium">
                  {application.distance_km ? `${application.distance_km} KM` : 'Not provided'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Annual Family Income</p>
                <p className="font-medium">
                  {application.annual_income ? `₹${application.annual_income.toLocaleString()}` : 'Not provided'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentInformationCard;
