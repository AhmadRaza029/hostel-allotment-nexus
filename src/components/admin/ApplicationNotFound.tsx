
import React from 'react';
import { AlertCircle } from 'lucide-react';

const ApplicationNotFound = () => {
  return (
    <div className="flex items-center justify-center h-48">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
        <h2 className="text-2xl font-bold mb-2">Application Not Found</h2>
        <p className="text-muted-foreground">
          The requested application could not be found or has been deleted.
        </p>
      </div>
    </div>
  );
};

export default ApplicationNotFound;
