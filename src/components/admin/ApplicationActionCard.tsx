
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Application } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface ApplicationActionCardProps {
  application: Application;
  onApplicationProcessed: (status: 'APPROVED' | 'REJECTED', remarks: string) => void;
}

const ApplicationActionCard = ({ application, onApplicationProcessed }: ApplicationActionCardProps) => {
  const [remarks, setRemarks] = useState(application.remarks || '');
  const [processingAction, setProcessingAction] = useState(false);

  const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
    if (!application) return;
    
    setProcessingAction(true);
    try {
      let roomNumber = '';
      let hostelId = '';
      let paymentAmount = 0;
      
      if (status === 'APPROVED') {
        // Get preferred hostel
        const preferredHostelId = application.hostel_preference?.[0];
        
        if (!preferredHostelId) {
          toast({
            title: "Error",
            description: "No hostel preference found in application",
            variant: "destructive"
          });
          setProcessingAction(false);
          return;
        }
        
        // Get a random room number for this demo
        roomNumber = `${Math.floor(Math.random() * 500) + 100}`;
        hostelId = preferredHostelId;
        
        // Get fee amount from settings
        const { data: feeData, error: feeError } = await supabase
          .from('settings')
          .select('value')
          .eq('key', 'hostel_fees')
          .single();
          
        if (feeError) throw feeError;
        
        const fees = feeData.value as { general: number, reserved: number };
        paymentAmount = application.category === 'GENERAL' ? fees.general : fees.reserved;
      }
      
      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ 
          status: status,
          remarks: remarks,
          updated_at: new Date().toISOString()
        })
        .eq('id', application.id);
        
      if (updateError) throw updateError;
      
      // If approved, create allocation
      if (status === 'APPROVED') {
        const { error: allocationError } = await supabase
          .from('allocations')
          .insert({
            application_id: application.id,
            hostel_id: hostelId,
            room_number: roomNumber,
            payment_status: 'PENDING',
            payment_amount: paymentAmount,
            allotment_date: new Date().toISOString()
          });
          
        if (allocationError) throw allocationError;
      }
      
      toast({
        title: "Success",
        description: `Application ${status.toLowerCase()} successfully`,
        variant: "default"
      });
      
      // Call the parent handler to update the UI
      onApplicationProcessed(status, remarks);
      
    } catch (error) {
      console.error('Error processing application:', error);
      toast({
        title: "Error",
        description: `Failed to ${status.toLowerCase()} application`,
        variant: "destructive"
      });
    } finally {
      setProcessingAction(false);
    }
  };

  if (application.status !== 'PENDING') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Application Status</CardTitle>
          <CardDescription>Review details of this application</CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center mb-4">
            <div 
              className={`h-12 w-12 rounded-full flex items-center justify-center mr-4
                ${application.status === 'APPROVED' ? 'bg-green-100' : 'bg-red-100'}`}
            >
              {application.status === 'APPROVED' ? (
                <CheckCircle className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
            </div>
            <div>
              <p className="font-semibold">
                Application {application.status.toLowerCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(application.updated_at), 'MMM dd, yyyy')}
              </p>
            </div>
          </div>
          
          {application.remarks && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Remarks / Comments
              </label>
              <div className="p-3 bg-gray-50 rounded-md text-sm">
                {application.remarks}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
        <CardDescription>
          Review and process this application
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">
              Remarks / Comments
            </label>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Add any notes or reasons for approval/rejection"
              className="w-full"
              rows={4}
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleAction('APPROVED')}
              disabled={processingAction}
              className="bg-green-600 hover:bg-green-700"
            >
              {processingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
              Approve Application
            </Button>
            
            <Button
              onClick={() => handleAction('REJECTED')}
              disabled={processingAction}
              variant="destructive"
            >
              {processingAction ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="mr-2 h-4 w-4" />
              )}
              Reject Application
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApplicationActionCard;
