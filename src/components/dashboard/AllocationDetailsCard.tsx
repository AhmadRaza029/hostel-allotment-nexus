
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Allocation, Hostel } from '@/types';

interface AllocationDetailsCardProps {
  allocation: Allocation;
  hostel: Hostel | null;
}

const AllocationDetailsCard = ({ allocation, hostel }: AllocationDetailsCardProps) => {
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'FAILED':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-500">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hostel Allocation</CardTitle>
        <CardDescription>Your room allocation details</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Hostel Name</p>
              <p className="font-medium">{hostel?.name || 'Not assigned'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Room Number</p>
              <p className="font-medium">{allocation.room_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Allotment Date</p>
              <p className="font-medium">
                {new Date(allocation.allotment_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Status</p>
              <p className="font-medium">
                {getPaymentStatusBadge(allocation.payment_status)}
              </p>
            </div>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="font-medium mb-2">Payment Details</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {allocation.payment_status === 'PENDING' ? (
                <>
                  <p className="mb-2">
                    <span className="font-medium">Amount Due:</span> ₹{allocation.payment_amount?.toLocaleString() || '0'}
                  </p>
                  <Button asChild>
                    <Link to="/allocation">Pay Hostel Fees</Link>
                  </Button>
                </>
              ) : allocation.payment_status === 'COMPLETED' ? (
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <p className="font-medium">Payment Complete - ₹{allocation.payment_amount?.toLocaleString() || '0'}</p>
                </div>
              ) : (
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <div>
                    <p className="font-medium">Payment Failed</p>
                    <p className="text-sm text-muted-foreground">Please try again</p>
                    <Button className="mt-2" size="sm" asChild>
                      <Link to="/allocation">Try Again</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <Button asChild>
            <Link to="/allocation">
              View Full Allocation Details
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationDetailsCard;
