
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Student } from '@/types';
import { User } from 'lucide-react';

interface StudentContactCardProps {
  student: Student;
}

const StudentContactCard = ({ student }: StudentContactCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Contact</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="h-10 w-10 rounded-full bg-hostel-primary/10 flex items-center justify-center mr-3">
            <User className="h-5 w-5 text-hostel-primary" />
          </div>
          <div>
            <p className="font-medium">{student.name}</p>
            <p className="text-sm text-muted-foreground">{student.department}</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm">
            <span className="font-medium">Email:</span> {student.email}
          </p>
          <p className="text-sm">
            <span className="font-medium">Phone:</span> {student.phone || 'Not provided'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentContactCard;
