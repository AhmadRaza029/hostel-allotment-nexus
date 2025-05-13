
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Home } from 'lucide-react';
import { Application, Allocation } from '@/types';

interface ImportantLinksCardProps {
  application: Application | null;
  allocation: Allocation | null;
  applicationPeriodActive: boolean;
}

const ImportantLinksCard = ({ 
  application,
  allocation,
  applicationPeriodActive
}: ImportantLinksCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Important Links</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <Button variant="outline" className="w-full justify-start" asChild>
            <Link to="/rules">
              <BookOpen className="mr-2 h-4 w-4" />
              Hostel Rules & Guidelines
            </Link>
          </Button>
          
          {!application && applicationPeriodActive && (
            <Button className="w-full justify-start" asChild>
              <Link to="/apply">
                <FileText className="mr-2 h-4 w-4" />
                Apply for Hostel
              </Link>
            </Button>
          )}
          
          {allocation && (
            <Button className="w-full justify-start" asChild>
              <Link to="/allocation">
                <Home className="mr-2 h-4 w-4" />
                View Allocation Details
              </Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantLinksCard;
