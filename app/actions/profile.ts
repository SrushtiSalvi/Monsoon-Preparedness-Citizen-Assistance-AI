'use server';

import { requireAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { profileSchema, updateProfileSchema } from '@/lib/validations';
import { AuthError, ValidationError, ConflictError, handleServerActionError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

async function getUserId() {
  try {
    return (await requireAuthenticatedUser()).id;
  } catch {
    throw new AuthError('User not authenticated');
  }
}

export interface CreateProfileInput {
  location: string;
  houseType: string;
  householdSize: number;
  children: number;
  elderly: number;
  pets?: string;
  medicalConditions?: string;
  medications?: string;
}

export async function createProfile(data: CreateProfileInput) {
  try {
    const userId = await getUserId();

    // Validate input
    const validated = profileSchema.parse(data);

    // Check if profile already exists
    const existing = await db.query.profile.findFirst({
      where: eq(profile.userId, userId),
    });

    if (existing) {
      const updated = await db
        .update(profile)
        .set({
          location: validated.location,
          houseType: validated.houseType,
          householdSize: validated.householdSize,
          children: validated.children,
          elderly: validated.elderly,
          pets: validated.pets || null,
          medicalConditions: validated.medicalConditions || null,
          medications: validated.medications || null,
          preparednessScore: calculatePreparednessScore(validated),
          riskLevel: calculateRiskLevel(validated.location),
          updatedAt: new Date(),
        })
        .where(eq(profile.userId, userId))
        .returning();

      logger.info('Profile updated during onboarding', { userId });
      revalidatePath('/dashboard');
      return updated[0];
    }

    // Calculate preparedness score based on inputs
    let score = 50; // Base score
    if (validated.householdSize > 0) score += 10;
    if (validated.children > 0) score += 5;
    if (validated.elderly > 0) score += 5;
    if (validated.pets) score += 5;
    if (validated.medicalConditions) score += 10;

    // Insert new profile
    const result = await db
      .insert(profile)
      .values({
        id: `profile_${userId}_${Date.now()}`,
        userId,
        location: validated.location,
        houseType: validated.houseType,
        householdSize: validated.householdSize,
        children: validated.children,
        elderly: validated.elderly,
        pets: validated.pets || null,
        medicalConditions: validated.medicalConditions || null,
        medications: validated.medications || null,
        preparednessScore: score,
        riskLevel: calculateRiskLevel(validated.location),
      })
      .returning();

    logger.info('Profile created', { userId });
    revalidatePath('/dashboard');
    return result[0];
  } catch (error) {
    logger.error('Failed to create profile', error);
    handleServerActionError(error);
  }
}

export async function getProfile() {
  try {
    const userId = await getUserId();

    const userProfile = await db.query.profile.findFirst({
      where: eq(profile.userId, userId),
    });

    return userProfile || null;
  } catch (error) {
    logger.error('Failed to fetch profile', error);
    handleServerActionError(error);
  }
}

export async function updateProfile(data: Partial<CreateProfileInput>) {
  try {
    const userId = await getUserId();

    // Validate input - allows partial updates
    const validated = updateProfileSchema.parse(data);

    const result = await db
      .update(profile)
      .set({
        ...validated,
        updatedAt: new Date(),
      })
      .where(eq(profile.userId, userId))
      .returning();

    if (!result.length) {
      throw new ConflictError('Profile not found');
    }

    logger.info('Profile updated', { userId });
    revalidatePath('/dashboard');
    return result[0];
  } catch (error) {
    logger.error('Failed to update profile', error);
    handleServerActionError(error);
  }
}

function calculatePreparednessScore(data: CreateProfileInput): number {
  let score = 50;
  if (data.householdSize > 0) score += 10;
  if (data.children > 0) score += 5;
  if (data.elderly > 0) score += 5;
  if (data.pets) score += 5;
  if (data.medicalConditions) score += 10;
  return score;
}

function calculateRiskLevel(location: string): string {
  // Simple heuristic based on known monsoon zones
  const highRiskZones = ['Mumbai', 'Kerala', 'Goa', 'Assam', 'Bangladesh'];
  const mediumRiskZones = ['Rajasthan', 'Gujarat', 'Karnataka', 'Telangana'];

  if (highRiskZones.some((zone) => location.toLowerCase().includes(zone.toLowerCase()))) {
    return 'high';
  }
  if (mediumRiskZones.some((zone) => location.toLowerCase().includes(zone.toLowerCase()))) {
    return 'medium';
  }
  return 'low';
}
