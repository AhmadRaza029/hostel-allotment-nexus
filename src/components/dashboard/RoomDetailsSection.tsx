
import React from 'react';
import { Hostel } from '@/types';

interface RoomDetailsSectionProps {
  hostel: Hostel | null;
  roomNumber: string;
  allotmentDate: string;
  paymentStatus: string;
}

const RoomDetailsSection = ({ 
  hostel, 
  roomNumber, 
  allotmentDate,
  paymentStatus 
}: RoomDetailsSectionProps) => {
  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">Paid</span>;
      case 'FAILED':
        return <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">Failed</span>;
      default:
        return <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">Pending</span>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Hostel Name</p>
        <p className="font-medium">{hostel?.name || 'Not assigned'}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Room Number</p>
        <p className="font-medium">{roomNumber}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Allotment Date</p>
        <p className="font-medium">
          {new Date(allotmentDate).toLocaleDateString()}
        </p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">Payment Status</p>
        <p className="font-medium">
          {getPaymentStatusBadge(paymentStatus)}
        </p>
      </div>
    </div>
  );
};

export default RoomDetailsSection;
