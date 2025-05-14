
import { z } from 'zod';

export const applicationFormSchema = z.object({
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

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>;
