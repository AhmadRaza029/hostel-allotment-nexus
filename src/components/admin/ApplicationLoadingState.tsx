
import React from 'react';
import { Loader2 } from 'lucide-react';

const ApplicationLoadingState = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-hostel-primary mr-2" />
      <span>Loading application details...</span>
    </div>
  );
};

export default ApplicationLoadingState;
