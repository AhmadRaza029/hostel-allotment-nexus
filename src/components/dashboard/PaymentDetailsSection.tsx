
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Allocation } from '@/types';

interface PaymentDetailsSectionProps {
  allocation: Allocation;
}

const PaymentDetailsSection = ({ allocation }: PaymentDetailsSectionProps) => {
  return (
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
  );
};

export default PaymentDetailsSection;
