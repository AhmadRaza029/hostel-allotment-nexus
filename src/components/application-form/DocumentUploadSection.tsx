
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';

interface DocumentUploadSectionProps {
  photoIdFile: File | null;
  incomeCertFile: File | null;
  paymentSlipFile: File | null;
  handlePhotoIdChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncomeCertChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePaymentSlipChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DocumentUploadSection = ({
  photoIdFile,
  incomeCertFile,
  paymentSlipFile,
  handlePhotoIdChange,
  handleIncomeCertChange,
  handlePaymentSlipChange,
}: DocumentUploadSectionProps) => {
  return (
    <div className="space-y-4 border p-4 rounded-md bg-gray-50">
      <h3 className="font-medium text-lg">Required Documents</h3>
      
      <div className="space-y-2">
        <FormLabel htmlFor="photo-id">Photo ID (Aadhar Card or Residence Certificate)</FormLabel>
        <div className="flex items-center gap-2">
          <Input
            id="photo-id"
            type="file"
            onChange={handlePhotoIdChange}
            accept=".jpg,.jpeg,.png,.pdf"
          />
          {photoIdFile && (
            <div className="text-sm text-green-600 flex items-center gap-1">
              <FileText className="h-4 w-4" /> {photoIdFile.name}
            </div>
          )}
        </div>
        <FormDescription>
          Upload a scanned copy or clear photo of your ID proof. (Max size: 2MB)
        </FormDescription>
      </div>
      
      <div className="space-y-2">
        <FormLabel htmlFor="income-cert">Income Certificate (if applicable)</FormLabel>
        <Input
          id="income-cert"
          type="file"
          onChange={handleIncomeCertChange}
          accept=".jpg,.jpeg,.png,.pdf"
        />
        {incomeCertFile && (
          <div className="text-sm text-green-600 flex items-center gap-1">
            <FileText className="h-4 w-4" /> {incomeCertFile.name}
          </div>
        )}
        <FormDescription>
          Required for fee concessions and priority allocation. (Max size: 2MB)
        </FormDescription>
      </div>
      
      <div className="space-y-2">
        <FormLabel htmlFor="payment-slip" className="font-medium">University Payment Receipt</FormLabel>
        <Input
          id="payment-slip"
          type="file"
          onChange={handlePaymentSlipChange}
          accept=".jpg,.jpeg,.png,.pdf"
          required
        />
        {paymentSlipFile && (
          <div className="text-sm text-green-600 flex items-center gap-1">
            <FileText className="h-4 w-4" /> {paymentSlipFile.name}
          </div>
        )}
        <FormDescription>
          Upload your university fee payment receipt. This is required for processing your application.
        </FormDescription>
      </div>
    </div>
  );
};

export default DocumentUploadSection;
