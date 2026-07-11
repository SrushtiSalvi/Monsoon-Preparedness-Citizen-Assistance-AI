-- Database indexes for optimal query performance
-- Run these in production after schema creation

-- User profile indexes
CREATE INDEX IF NOT EXISTS idx_profile_userId ON profile(userId);
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_userId_unique ON profile(userId);

-- Weather data indexes
CREATE INDEX IF NOT EXISTS idx_weather_userId ON weather_data(userId);
CREATE INDEX IF NOT EXISTS idx_weather_location ON weather_data(location);
CREATE INDEX IF NOT EXISTS idx_weather_lastUpdated ON weather_data(lastUpdated);

-- Checklist item indexes
CREATE INDEX IF NOT EXISTS idx_checklist_userId ON checklist_item(userId);
CREATE INDEX IF NOT EXISTS idx_checklist_category ON checklist_item(category);
CREATE INDEX IF NOT EXISTS idx_checklist_completed ON checklist_item(completed);

-- Session indexes (Better Auth)
CREATE INDEX IF NOT EXISTS idx_session_userId ON session(userId);
CREATE INDEX IF NOT EXISTS idx_session_token ON session(token);
CREATE INDEX IF NOT EXISTS idx_session_expiresAt ON session(expiresAt);

-- Account indexes (Better Auth)
CREATE INDEX IF NOT EXISTS idx_account_userId ON account(userId);
CREATE INDEX IF NOT EXISTS idx_account_providerId ON account(providerId);

-- Verification indexes
CREATE INDEX IF NOT EXISTS idx_verification_identifier ON verification(identifier);
CREATE INDEX IF NOT EXISTS idx_verification_expiresAt ON verification(expiresAt);

-- Analyze tables for query optimization
ANALYZE "user";
ANALYZE "session";
ANALYZE "account";
ANALYZE "verification";
ANALYZE "profile";
ANALYZE "checklist_item";
ANALYZE "weather_data";
