
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { Hostel } from '@/types';
import { ApplicationFormValues } from './ApplicationFormSchema';

interface HostelPreferencesSectionProps {
  form: UseFormReturn<ApplicationFormValues>;
  hostels: Hostel[];
}

const HostelPreferencesSection = ({ form, hostels }: HostelPreferencesSectionProps) => {
  return (
    <div>
      <FormLabel className="mb-2">Hostel Preferences</FormLabel>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {hostels.map((hostel) => (
          <FormField
            key={hostel.id}
            control={form.control}
            name="hostelPreferences"
            render={({ field }) => {
              return (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value?.includes(hostel.id)}
                      onCheckedChange={(checked) => {
                        return checked
                          ? field.onChange([...field.value || [], hostel.id])
                          : field.onChange(field.value?.filter((value) => value !== hostel.id));
                      }}
                    />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {hostel.name}
                  </FormLabel>
                </FormItem>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default HostelPreferencesSection;
