'use server';

import { NextResponse } from 'next/server';
import { getAuthenticatedUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { profile } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

function normalizeList(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return [];
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeProfile(profileRow: any) {
  return {
    ...profileRow,
    childrenCount: profileRow.children ?? 0,
    elderlyMembers: profileRow.elderly ?? 0,
    healthConditions: normalizeList(profileRow.medicalConditions),
    pets: normalizeList(profileRow.pets),
    homeType: profileRow.houseType ?? 'other',
    hasVehicle: false,
    checklistItems: [],
  };
}

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userProfile = await db.query.profile.findFirst({
      where: eq(profile.userId, user.id),
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({ profile: normalizeProfile(userProfile) });
  } catch (error) {
    console.error('[api/profile] failed to load profile', error);
    return NextResponse.json({ error: 'Failed to load profile' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const existing = await db.query.profile.findFirst({
      where: eq(profile.userId, user.id),
    });

    if (!existing) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const updated = await db
      .update(profile)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(profile.userId, user.id))
      .returning();

    return NextResponse.json({ profile: normalizeProfile(updated[0]) });
  } catch (error) {
    console.error('[api/profile] failed to update profile', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
