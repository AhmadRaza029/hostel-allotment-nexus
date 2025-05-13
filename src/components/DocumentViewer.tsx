
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Eye, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface DocumentViewerProps {
  filePath: string | null | undefined;
  label: string;
  docType: 'photo_id' | 'income_cert' | 'payment_slip';
}

const DocumentViewer = ({ filePath, label, docType }: DocumentViewerProps) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    const getFileUrl = async () => {
      if (!filePath) {
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase.storage
          .from('hostel-documents')
          .createSignedUrl(filePath, 60 * 5); // 5 minutes expiration
          
        if (error) throw error;
        
        setFileUrl(data.signedUrl);
        
        // Determine file type
        if (filePath.toLowerCase().endsWith('.pdf')) {
          setFileType('pdf');
        } else {
          setFileType('image');
        }
        
      } catch (error) {
        console.error('Error getting document URL:', error);
        toast.error('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    
    getFileUrl();
  }, [filePath]);

  const handleDownload = async () => {
    if (!filePath) return;
    
    try {
      const { data, error } = await supabase.storage
        .from('hostel-documents')
        .download(filePath);
        
      if (error) throw error;
      
      // Create a download link and click it
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || `${docType}_document`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Failed to download document');
    }
  };

  if (!filePath) {
    return (
      <div className="p-4 border rounded-md bg-gray-50 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <FileText className="h-5 w-5" />
          <span>No {label} uploaded</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-4 border rounded-md bg-gray-50">
        <div className="animate-pulse h-6 w-3/4 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-hostel-primary" />
          <span className="font-medium">{label}</span>
        </div>
        
        <div className="flex space-x-2">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl">
              <DialogHeader>
                <DialogTitle>{label}</DialogTitle>
              </DialogHeader>
              <div className="mt-4 overflow-hidden">
                {fileType === 'image' && fileUrl && (
                  <img 
                    src={fileUrl} 
                    alt={label} 
                    className="max-w-full max-h-[70vh] mx-auto rounded-md"
                  />
                )}
                {fileType === 'pdf' && fileUrl && (
                  <iframe 
                    src={`${fileUrl}#toolbar=0`}
                    title={label}
                    className="w-full h-[70vh] border-0 rounded-md"
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
          
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
