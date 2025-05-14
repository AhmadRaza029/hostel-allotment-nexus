
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Application, Allocation } from '@/types';
import { ChevronRight, FileText, CreditCard } from 'lucide-react';

interface ImportantLinksCardProps {
  application: Application | null;
  allocation: Allocation | null;
  applicationPeriodActive: boolean;
}

const ImportantLinksCard = ({ application, allocation, applicationPeriodActive }: ImportantLinksCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Important Links</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1">
        {!application && applicationPeriodActive && (
          <Link 
            to="/apply" 
            className="flex items-center justify-between py-2 px-1 hover:bg-muted rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">Apply for Hostel</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
        
        {application?.status === 'APPROVED' && (
          <Link 
            to="/allocation" 
            className="flex items-center justify-between py-2 px-1 hover:bg-muted rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm">Allocation Details</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
        
        {application?.status === 'APPROVED' && allocation && allocation.payment_status === 'PENDING' && (
          <Link 
            to="/payment" 
            className="flex items-center justify-between py-2 px-1 hover:bg-muted rounded-md transition-colors"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-sm">Make Payment</span>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        )}
        
        <Link 
          to="/rules" 
          className="flex items-center justify-between py-2 px-1 hover:bg-muted rounded-md transition-colors"
        >
          <div className="flex items-center gap-3">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm">Hostel Rules</span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default ImportantLinksCard;
