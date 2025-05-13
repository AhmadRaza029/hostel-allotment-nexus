
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Allocation, Hostel } from '@/types';
import PaymentDetailsSection from './PaymentDetailsSection';
import RoomDetailsSection from './RoomDetailsSection';

interface AllocationDetailsCardProps {
  allocation: Allocation;
  hostel: Hostel | null;
}

const AllocationDetailsCard = ({ allocation, hostel }: AllocationDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hostel Allocation</CardTitle>
        <CardDescription>Your room allocation details</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <RoomDetailsSection 
            hostel={hostel}
            roomNumber={allocation.room_number}
            allotmentDate={allocation.allotment_date}
            paymentStatus={allocation.payment_status}
          />
          
          <Separator />
          
          <PaymentDetailsSection allocation={allocation} />
          
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
