
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/types';
import { format } from 'date-fns';

interface ApplicationHeaderCardProps {
  application: Application;
}

const ApplicationHeaderCard = ({ application }: ApplicationHeaderCardProps) => {
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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Application #{application.id.slice(-8)}</CardTitle>
            <CardDescription>
              Submitted on {format(new Date(application.created_at), 'MMM dd, yyyy')}
            </CardDescription>
          </div>
          {getStatusBadge(application.status)}
        </div>
      </CardHeader>
    </Card>
  );
};

export default ApplicationHeaderCard;
