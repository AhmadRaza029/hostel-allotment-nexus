
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { UseFormReturn } from 'react-hook-form';
import { Hostel } from '@/types';
import { z } from 'zod';

const formSchema = z.object({
  academicYear: z.string().min(4, "Please select an academic year"),
  currentYear: z.string().min(1, "Please select your current year"),
  cgpa: z.string().optional(),
  homeAddress: z.string().min(5, "Please enter your complete home address"),
  distanceKm: z.string().optional(),
  annualIncome: z.string().optional(),
  category: z.string().optional(),
  hostelPreferences: z.array(z.string()).optional(),
  confirmRules: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the hostel rules" }),
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface HostelPreferencesSectionProps {
  form: UseFormReturn<FormValues>;
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
