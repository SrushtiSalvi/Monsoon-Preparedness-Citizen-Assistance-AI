'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from './Card';

export interface OnboardingData {
  location: string;
  householdSize: number;
  childrenCount: number;
  elderlyMembers: number;
  healthConditions: string[];
  pets: string[];
  homeType: string;
  hasVehicle: boolean;
}

export interface OnboardingFormProps {
  onSubmit: (data: OnboardingData) => Promise<void>;
  onCancel: () => void;
}

export function OnboardingForm({ onSubmit, onCancel }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<OnboardingData>({
    location: '',
    householdSize: 4,
    childrenCount: 0,
    elderlyMembers: 0,
    healthConditions: [],
    pets: [],
    homeType: 'standard',
    hasVehicle: false,
  });

  const handleNext = async () => {
    if (step === 1 && !formData.location.trim()) {
      setError('Please enter your location');
      return;
    }
    if (step < 4) {
      setStep(step + 1);
      setError('');
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (key: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleHealthConditionChange = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      healthConditions: prev.healthConditions.includes(condition)
        ? prev.healthConditions.filter(h => h !== condition)
        : [...prev.healthConditions, condition],
    }));
  };

  const handlePetChange = (pet: string) => {
    setFormData(prev => ({
      ...prev,
      pets: prev.pets.includes(pet)
        ? prev.pets.filter(p => p !== pet)
        : [...prev.pets, pet],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? 'bg-teal-600' : 'bg-gray-200'
                } ${s < 4 ? 'mr-2' : ''}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600">Step {step} of 4</p>
        </div>

        <Card className="mb-6">
          {/* Step 1: Location & Household */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Where are you located?</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City/Town Name
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={e => {
                      updateFormData('location', e.target.value);
                      setError('');
                    }}
                    placeholder="e.g., Mumbai, Bangalore, Chennai"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many people live in your household?
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.householdSize}
                    onChange={e => updateFormData('householdSize', parseInt(e.target.value) || 1)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    {error}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Family Composition */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your family</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Children (Age 0-18)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.childrenCount}
                    onChange={e => updateFormData('childrenCount', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Elderly Members (Age 65+)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.elderlyMembers}
                    onChange={e => updateFormData('elderlyMembers', parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Any health conditions? (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {['Asthma', 'Diabetes', 'Hypertension', 'Cardiac', 'Respiratory'].map(
                      condition => (
                        <label key={condition} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.healthConditions.includes(condition)}
                            onChange={() => handleHealthConditionChange(condition)}
                            className="w-4 h-4 rounded border-gray-300 text-teal-600"
                          />
                          <span className="ml-3 text-gray-700">{condition}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Home & Pets */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell us about your home</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Type of residence
                  </label>
                  <div className="space-y-2">
                    {['standard', 'low-lying', 'basement', 'high-rise'].map(type => (
                      <label key={type} className="flex items-center">
                        <input
                          type="radio"
                          name="homeType"
                          value={type}
                          checked={formData.homeType === type}
                          onChange={() => updateFormData('homeType', type)}
                          className="w-4 h-4 text-teal-600"
                        />
                        <span className="ml-3 text-gray-700 capitalize">
                          {type === 'low-lying' ? 'Low-lying area' : type === 'high-rise' ? 'High-rise building' : 'Standard/Elevated'}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.hasVehicle}
                      onChange={e => updateFormData('hasVehicle', e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-teal-600"
                    />
                    <span className="ml-3 text-gray-700">Do you have a vehicle?</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Pets at home? (Select all that apply)
                  </label>
                  <div className="space-y-2">
                    {['Dogs', 'Cats', 'Birds', 'Fish', 'Other'].map(pet => (
                      <label key={pet} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.pets.includes(pet)}
                          onChange={() => handlePetChange(pet)}
                          className="w-4 h-4 rounded border-gray-300 text-teal-600"
                        />
                        <span className="ml-3 text-gray-700">{pet}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review your information</h2>

              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-semibold text-gray-900">{formData.location}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Household size:</span>
                  <span className="font-semibold text-gray-900">{formData.householdSize} people</span>
                </div>
                {formData.childrenCount > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Children:</span>
                    <span className="font-semibold text-gray-900">{formData.childrenCount}</span>
                  </div>
                )}
                {formData.elderlyMembers > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Elderly members:</span>
                    <span className="font-semibold text-gray-900">{formData.elderlyMembers}</span>
                  </div>
                )}
                {formData.healthConditions.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Health conditions:</span>
                    <span className="font-semibold text-gray-900">{formData.healthConditions.join(', ')}</span>
                  </div>
                )}
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Home type:</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {formData.homeType === 'low-lying' ? 'Low-lying' : formData.homeType === 'high-rise' ? 'High-rise' : 'Standard'}
                  </span>
                </div>
                {formData.hasVehicle && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Vehicle:</span>
                    <span className="font-semibold text-gray-900">Yes</span>
                  </div>
                )}
                {formData.pets.length > 0 && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Pets:</span>
                    <span className="font-semibold text-gray-900">{formData.pets.join(', ')}</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              onClick={() => {
                if (step > 1) {
                  setStep(step - 1);
                  setError('');
                } else {
                  onCancel();
                }
              }}
              disabled={loading}
            >
              {step === 1 ? 'Cancel' : 'Back'}
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading}
              className="flex-1 bg-teal-600 hover:bg-teal-700"
            >
              {loading ? 'Saving...' : step === 4 ? 'Complete Setup' : 'Next'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
