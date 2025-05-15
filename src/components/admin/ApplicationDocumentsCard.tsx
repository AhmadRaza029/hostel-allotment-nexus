
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentViewer from '@/components/DocumentViewer';
import { Application } from '@/types';

interface ApplicationDocumentsCardProps {
  application: Application;
}

const ApplicationDocumentsCard = ({ application }: ApplicationDocumentsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Documents</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <DocumentViewer 
            filePath={application.photo_id_url} 
            label="Photo ID / Residence Certificate" 
            docType="photo_id" 
          />
          
          <DocumentViewer 
            filePath={application.income_cert_url} 
            label="Income Certificate" 
            docType="income_cert" 
          />
          
          <DocumentViewer 
            filePath={application.payment_slip_url} 
            label="University Payment Receipt" 
            docType="payment_slip" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationDocumentsCard;
