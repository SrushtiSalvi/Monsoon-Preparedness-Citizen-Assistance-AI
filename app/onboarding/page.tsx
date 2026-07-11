'use client';

import { useRouter } from 'next/navigation';
import { OnboardingForm, OnboardingData } from '@/components/OnboardingForm';
import { createProfile } from '@/app/actions/profile';

function normalizeHouseType(homeType: string): 'apartment' | 'house' | 'village' | 'other' {
  switch (homeType) {
    case 'high-rise':
    case 'apartment':
      return 'apartment';
    case 'standard':
    case 'low-lying':
    case 'basement':
    case 'house':
      return 'house';
    case 'village':
      return 'village';
    default:
      return 'other';
  }
}

export default function OnboardingPage() {
  const router = useRouter();

  const handleSubmit = async (data: OnboardingData) => {
    try {
      // Map form data to profile schema
      await createProfile({
        location: data.location,
        houseType: normalizeHouseType(data.homeType),
        householdSize: data.householdSize,
        children: data.childrenCount,
        elderly: data.elderlyMembers,
        pets: data.pets.join(', ') || undefined,
        medicalConditions: data.healthConditions.join(', ') || undefined,
      });

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  return <OnboardingForm onSubmit={handleSubmit} onCancel={() => router.back()} />;
}
