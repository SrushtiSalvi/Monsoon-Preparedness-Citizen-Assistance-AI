import { pgTable, text, timestamp, boolean, integer, decimal, serial, uniqueIndex, foreignKey } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Better Auth Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete('cascade'),
}));

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete('cascade'),
}));

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true }),
  updatedAt: timestamp('updatedAt', { withTimezone: true }),
});

// Monsoon App Tables
export const profile = pgTable('profile', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  location: text('location').notNull(),
  houseType: text('houseType').notNull(),
  householdSize: integer('householdSize').notNull(),
  children: integer('children').notNull().default(0),
  elderly: integer('elderly').notNull().default(0),
  pets: text('pets'),
  medicalConditions: text('medicalConditions'),
  medications: text('medications'),
  preparednessScore: integer('preparednessScore').notNull().default(0),
  riskLevel: text('riskLevel').notNull().default('moderate'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete('cascade'),
}));

export const checklistItem = pgTable('checklist_item', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  category: text('category').notNull(),
  item: text('item').notNull(),
  completed: boolean('completed').notNull().default(false),
  priority: text('priority').notNull().default('medium'),
  createdAt: timestamp('createdAt', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete('cascade'),
}));

export const weatherData = pgTable('weather_data', {
  id: text('id').primaryKey(),
  userId: text('userId').notNull(),
  location: text('location').notNull(),
  currentTemp: integer('currentTemp'),
  condition: text('condition'),
  humidity: integer('humidity'),
  windSpeed: integer('windSpeed'),
  rainfall: decimal('rainfall'),
  floodRisk: text('floodRisk').notNull().default('low'),
  forecast: text('forecast'),
  lastUpdated: timestamp('lastUpdated', { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  userIdIdx: foreignKey({ columns: [table.userId], foreignColumns: [user.id] }).onDelete('cascade'),
}));

// Relations
export const userRelations = relations(user, ({ one, many }) => ({
  profile: one(profile),
  sessions: many(session),
  accounts: many(account),
  checklistItems: many(checklistItem),
  weatherData: many(weatherData),
}));

export const profileRelations = relations(profile, ({ one }) => ({
  user: one(user, {
    fields: [profile.userId],
    references: [user.id],
  }),
}));

export const checklistItemRelations = relations(checklistItem, ({ one }) => ({
  user: one(user, {
    fields: [checklistItem.userId],
    references: [user.id],
  }),
}));

export const weatherDataRelations = relations(weatherData, ({ one }) => ({
  user: one(user, {
    fields: [weatherData.userId],
    references: [user.id],
  }),
}));
