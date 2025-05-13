
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { User } from 'lucide-react';
import { Student } from '@/types';

interface StudentProfileCardProps {
  student: Student | null;
}

const StudentProfileCard = ({ student }: StudentProfileCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Profile</CardTitle>
      </CardHeader>
      
      <CardContent>
        {student ? (
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="h-12 w-12 rounded-full bg-hostel-primary/10 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-hostel-primary" />
              </div>
              <div>
                <h3 className="font-medium">{student.name}</h3>
                <p className="text-sm text-muted-foreground">{student.department}</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-muted-foreground">Email:</span>{" "}
                {student.email}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Phone:</span>{" "}
                {student.phone || "Not provided"}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Gender:</span>{" "}
                {student.gender}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <User className="h-12 w-12 text-muted-foreground mb-2" />
            <p>Profile not found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StudentProfileCard;
