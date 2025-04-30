import { pgTable, text, serial, integer, boolean, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
  role: text("role").default("user"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  avatar: true,
  bio: true,
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  thumbnail: text("thumbnail").notNull(),
  totalModules: integer("total_modules").notNull(),
  level: text("level").notNull(), // beginner, intermediate, advanced
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  category: true,
  thumbnail: true,
  totalModules: true,
  level: true,
});

export const userCourses = pgTable("user_courses", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  courseId: integer("course_id").notNull().references(() => courses.id),
  completedModules: integer("completed_modules").default(0),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow(),
});

export const insertUserCourseSchema = createInsertSchema(userCourses).pick({
  userId: true,
  courseId: true,
  completedModules: true,
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // algorithm, frontend, backend, etc.
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  participants: integer("participants").default(0),
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  title: true,
  description: true,
  category: true,
  difficulty: true,
});

export const discussions = pgTable("discussions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  upvotes: integer("upvotes").default(0),
  views: integer("views").default(0),
  comments: integer("comments").default(0),
});

export const insertDiscussionSchema = createInsertSchema(discussions).pick({
  title: true,
  content: true,
  userId: true,
});

export const discussionTags = pgTable("discussion_tags", {
  id: serial("id").primaryKey(),
  discussionId: integer("discussion_id").notNull().references(() => discussions.id),
  tag: text("tag").notNull(),
});

export const insertDiscussionTagSchema = createInsertSchema(discussionTags).pick({
  discussionId: true,
  tag: true,
});

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  salary: text("salary"),
  logoUrl: text("logo_url"),
  postedAt: timestamp("posted_at").defaultNow(),
});

export const insertJobSchema = createInsertSchema(jobs).pick({
  title: true,
  company: true,
  location: true,
  description: true,
  salary: true,
  logoUrl: true,
});

export const jobTags = pgTable("job_tags", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").notNull().references(() => jobs.id),
  tag: text("tag").notNull(),
});

export const insertJobTagSchema = createInsertSchema(jobTags).pick({
  jobId: true,
  tag: true,
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
  category: text("category").notNull(),
  thumbnail: text("thumbnail"),
});

export const insertProjectSchema = createInsertSchema(projects).pick({
  title: true,
  description: true,
  difficulty: true,
  category: true,
  thumbnail: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;

export type UserCourse = typeof userCourses.$inferSelect;
export type InsertUserCourse = z.infer<typeof insertUserCourseSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type Discussion = typeof discussions.$inferSelect;
export type InsertDiscussion = z.infer<typeof insertDiscussionSchema>;

export type DiscussionTag = typeof discussionTags.$inferSelect;
export type InsertDiscussionTag = z.infer<typeof insertDiscussionTagSchema>;

export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;

export type JobTag = typeof jobTags.$inferSelect;
export type InsertJobTag = z.infer<typeof insertJobTagSchema>;

export type Project = typeof projects.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
