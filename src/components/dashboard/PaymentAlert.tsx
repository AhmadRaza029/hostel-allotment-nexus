
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Allocation } from '@/types';

interface PaymentAlertProps {
  allocation: Allocation;
}

const PaymentAlert = ({ allocation }: PaymentAlertProps) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Complete Your Admission</AlertTitle>
      <AlertDescription>
        Please complete your hostel fee payment to finalize your admission.
      </AlertDescription>
      {allocation.payment_status === 'PENDING' && (
        <Button size="sm" className="mt-2" asChild>
          <Link to="/allocation">Pay Now</Link>
        </Button>
      )}
    </Alert>
  );
};

export default PaymentAlert;
