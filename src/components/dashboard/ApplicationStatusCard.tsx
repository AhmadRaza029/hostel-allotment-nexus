
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, CheckCircle, AlertCircle, FileText, Receipt 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Application } from '@/types';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

interface ApplicationStatusCardProps {
  application: Application | null;
  applicationPeriodActive: boolean;
}

const ApplicationStatusCard = ({ 
  application, 
  applicationPeriodActive 
}: ApplicationStatusCardProps) => {
  
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
        <CardTitle>Application Status</CardTitle>
        <CardDescription>View your hostel application status</CardDescription>
      </CardHeader>
      
      <CardContent>
        {!application ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Application Found</h3>
            <p className="text-muted-foreground mb-4">
              You haven't submitted a hostel application yet.
            </p>
            {applicationPeriodActive ? (
              <Button asChild>
                <Link to="/apply">Apply Now</Link>
              </Button>
            ) : (
              <Alert className="mt-2 mx-auto max-w-md">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Application Period Closed</AlertTitle>
                <AlertDescription>
                  Hostel applications are currently closed. Please check back later.
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-medium">Application #{application.id.slice(-8)}</h3>
                <p className="text-sm text-muted-foreground">
                  Submitted {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                </p>
              </div>
              {getStatusBadge(application.status)}
            </div>
            
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Academic Year</TableCell>
                  <TableCell>{application.academic_year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Year of Study</TableCell>
                  <TableCell>{application.current_year}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Documents Submitted</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {application.photo_id_url && (
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <FileText className="h-3 w-3" /> ID Proof
                        </Badge>
                      )}
                      {application.income_cert_url && (
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <FileText className="h-3 w-3" /> Income Certificate
                        </Badge>
                      )}
                      {application.payment_slip_url && (
                        <Badge variant="outline" className="flex gap-1 items-center">
                          <Receipt className="h-3 w-3" /> Payment Receipt
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            
            {application.status === 'APPROVED' ? (
              <Alert className="mt-6 bg-green-50 border-green-200">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <AlertTitle>Application Approved</AlertTitle>
                <AlertDescription>
                  Your hostel application has been approved. Please check allocation details.
                </AlertDescription>
              </Alert>
            ) : application.status === 'REJECTED' ? (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Application Rejected</AlertTitle>
                <AlertDescription>
                  {application.remarks || 'Your application does not meet the eligibility criteria.'}
                  {applicationPeriodActive && (
                    <div className="mt-2">
                      <Button asChild size="sm">
                        <Link to="/apply">Apply Again</Link>
                      </Button>
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="mt-6 bg-yellow-50 border-yellow-200">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <AlertTitle>Application Under Review</AlertTitle>
                <AlertDescription>
                  Your application is currently being reviewed. We'll notify you when a decision is made.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApplicationStatusCard;
