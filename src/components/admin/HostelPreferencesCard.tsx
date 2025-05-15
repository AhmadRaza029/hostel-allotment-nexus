
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Application } from '@/types';

interface HostelPreferencesCardProps {
  application: Application;
}

const HostelPreferencesCard = ({ application }: HostelPreferencesCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Hostel Preferences</CardTitle>
      </CardHeader>
      
      <CardContent>
        {application.hostel_preference && application.hostel_preference.length > 0 ? (
          <ul className="list-disc pl-5 space-y-1">
            {application.hostel_preference.map((hostelId, index) => (
              <li key={hostelId}>
                <p className="font-medium">Preference {index + 1}: {hostelId}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No hostel preferences specified</p>
        )}
      </CardContent>
    </Card>
  );
};

export default HostelPreferencesCard;
