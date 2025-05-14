import React from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormValues } from './ApplicationFormSchema';

interface BasicInfoSectionProps {
  form: UseFormReturn<ApplicationFormValues>;
}

const BasicInfoSection = ({ form }: BasicInfoSectionProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="academicYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Academic Year</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="2024-2025">2024-2025</SelectItem>
                  <SelectItem value="2025-2026">2025-2026</SelectItem>
                  <SelectItem value="2026-2027">2026-2027</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="currentYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Year of Study</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="1">First Year</SelectItem>
                  <SelectItem value="2">Second Year</SelectItem>
                  <SelectItem value="3">Third Year</SelectItem>
                  <SelectItem value="4">Fourth Year</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="cgpa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>CGPA (if applicable)</FormLabel>
            <FormControl>
              <Input placeholder="Enter your CGPA" {...field} />
            </FormControl>
            <FormDescription>
              If you don't have a CGPA, you can leave this field blank.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="homeAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Home Address</FormLabel>
            <FormControl>
              <Textarea placeholder="Enter your complete home address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distanceKm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distance from Campus (in KM)</FormLabel>
              <FormControl>
                <Input placeholder="Enter distance in kilometers" type="number" {...field} />
              </FormControl>
              <FormDescription>
                Approximate distance between your home and the campus.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="annualIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Annual Family Income (₹)</FormLabel>
              <FormControl>
                <Input placeholder="Enter annual family income" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="GENERAL">General</SelectItem>
                <SelectItem value="OBC">OBC</SelectItem>
                <SelectItem value="SC">SC</SelectItem>
                <SelectItem value="ST">ST</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default BasicInfoSection;
