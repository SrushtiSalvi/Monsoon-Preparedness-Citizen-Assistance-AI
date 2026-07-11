import { z } from 'zod';

// Auth validation schemas
export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').regex(/[A-Z]/, 'Password must contain uppercase').regex(/[0-9]/, 'Password must contain number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
});

export const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Profile validation schemas
export const profileSchema = z.object({
  location: z.string().min(1, 'Location is required').max(200),
  houseType: z.enum(['apartment', 'house', 'village', 'other']),
  householdSize: z.number().min(1).max(20),
  children: z.number().min(0).max(20),
  elderly: z.number().min(0).max(20),
  pets: z.string().max(500).optional(),
  medicalConditions: z.string().max(500).optional(),
  medications: z.string().max(500).optional(),
});

export const updateProfileSchema = profileSchema.partial();

// Onboarding form validation
export const onboardingSchema = z.object({
  location: z.string().min(1, 'Location required'),
  homeType: z.enum(['apartment', 'house', 'village', 'other']),
  householdSize: z.number().min(1).max(20),
  childrenCount: z.number().min(0).max(20),
  elderlyMembers: z.number().min(0).max(20),
  healthConditions: z.array(z.string()).default([]),
  pets: z.array(z.string()).default([]),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type OnboardingInput = z.infer<typeof onboardingSchema>;
