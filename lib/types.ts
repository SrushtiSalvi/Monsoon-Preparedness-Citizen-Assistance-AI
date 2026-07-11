// User types from Better Auth
export interface BetterAuthUser {
  id: string;
  email: string;
  name: string | null;
  emailVerified: boolean;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// User profile types for Neon
export interface UserProfile {
  id: string;
  userId: string;
  location: string;
  houseType: string;
  householdSize: number;
  children: number;
  elderly: number;
  pets: string | null;
  medicalConditions: string | null;
  medications: string | null;
  preparednessScore: number;
  riskLevel: "low" | "medium" | "high";
  createdAt: Date;
  updatedAt: Date;
}

// Weather types
export interface WeatherForecast {
  label: string;
  rainMM: number;
  tempC: number;
}

export interface Weather {
  rainfallMM: number;
  rainProbability: number;
  tempC: number;
  humidity: number;
  windKmph: number;
  visibilityKm: number;
  uvIndex: number;
  floodRisk: number;
  forecast: WeatherForecast[];
}

// Preparedness types
export interface Recommendation {
  id: string | number;
  text: string;
  priority: "high" | "medium" | "low";
  category: string;
  source: "rule_engine" | "ai";
}

export interface Preparednessплан {
  _id?: ObjectId;
  userId: ObjectId | string;
  generatedAt: Date;
  score: number;
  riskLevel: "low" | "medium" | "high" | "severe";
  recommendations: Recommendation[];
  weatherSnapshot?: Weather;
}

// Checklist types
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface ChecklistCategory {
  label: string;
  icon?: any;
  items: ChecklistItem[];
}

export interface Checklist {
  _id?: ObjectId;
  userId: ObjectId | string;
  categories: Record<string, ChecklistCategory>;
  progress: number;
  updatedAt: Date;
}

// Travel types
export interface TravelPlan {
  _id?: ObjectId;
  userId: ObjectId | string;
  origin: string;
  destination: string;
  travelDate: Date;
  mode: "car" | "bike" | "train" | "bus" | "flight";
  aiAssessment?: {
    riskLevel: string;
    alternativeRoutes: string[];
    packingSuggestions: string[];
    weatherImpact: string;
    estimatedDelay: string;
    safetyTips: string[];
  };
  createdAt: Date;
}

// Alert types
export interface Alert {
  _id?: ObjectId;
  userId: ObjectId | string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  type: "weather" | "health" | "travel" | "emergency";
  source: "government" | "system" | "community";
  location?: string;
  createdAt: Date;
  read: boolean;
}

// Risk assessment types
export interface RiskAssessment {
  level: "low" | "medium" | "high" | "severe";
  score: number;
  color: string;
  background: string;
}

// Session context for API routes
export interface SessionContext {
  userId: string;
  clerkId: string;
  email: string;
}
