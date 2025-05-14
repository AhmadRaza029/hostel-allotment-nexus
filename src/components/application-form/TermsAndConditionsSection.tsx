
import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from './ApplicationFormSchema';

interface TermsAndConditionsSectionProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const TermsAndConditionsSection = ({ form }: TermsAndConditionsSectionProps) => {
  return (
    <FormField
      control={form.control}
      name="confirmRules"
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox 
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-y-1 leading-tight">
            <FormLabel className="text-base font-semibold">
              I agree to abide by all hostel rules and regulations.
            </FormLabel>
            <FormDescription>
              <Link to="/rules" className="text-hostel-primary hover:underline">
                View Hostel Rules
              </Link>
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};

export default TermsAndConditionsSection;
