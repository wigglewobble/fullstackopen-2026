import { z } from 'zod';
import { Gender, HealthCheckRating } from './types.ts';

export const NewPatientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" }),
  ssn: z.string().min(1, "SSN is required"),
  gender: z.nativeEnum(Gender),
  occupation: z.string().min(1, "Occupation is required"),
});

const BaseEntrySchema = z.object({
  description: z.string().min(1, "Description is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" }),
  specialist: z.string().min(1, "Specialist is required"),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewEntrySchema = z.discriminatedUnion("type", [
  BaseEntrySchema.extend({
    type: z.literal("HealthCheck"),
    healthCheckRating: z.nativeEnum(HealthCheckRating),
  }),
  BaseEntrySchema.extend({
    type: z.literal("Hospital"),
    discharge: z.object({
      date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" }),
      criteria: z.string().min(1, "Criteria is required"),
    }),
  }),
  BaseEntrySchema.extend({
    type: z.literal("OccupationalHealthcare"),
    employerName: z.string().min(1, "Employer name is required"),
    sickLeave: z.object({
      startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" }),
      endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Invalid date format. Expected YYYY-MM-DD" }),
    }).optional(),
  }),
]);
