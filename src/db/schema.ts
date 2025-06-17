import {
    pgTable,
    serial,
    text,
    timestamp,
    integer,
    boolean,
    json,
    varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  password: varchar("password", { length: 255 }),
  role: varchar("role", { length: 20 }).notNull().default("student"),
  avatarUrl: text("avatar_url"),
  googleId: varchar("google_id", { length: 255 }).unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});

// export const activities = pgTable("activities", {
//     id: serial("id").primaryKey(),
//     title: varchar("title", { length: 255 }).notNull(),
//     description: text("description"),
//     skill: varchar("skill", { length: 20 }).notNull(), // 'reading', 'listening', 'writing', 'speaking'
//     hotsType: varchar("hots_type", { length: 50 }).notNull(), // 'analyze', 'evaluate', 'create', 'problem-solve', 'infer'
//     difficulty: integer("difficulty").notNull().default(1), // 1-5
//     content: text("content"), // Text content for the activity
//     audioUrl: text("audio_url"), // URL for listening activities
//     videoUrl: text("video_url"), // URL for video content
//     createdBy: integer("created_by").references(() => users.id),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const modules = pgTable("modules", {
//     id: serial("id").primaryKey(),
//     title: varchar("title", { length: 255 }).notNull(),
//     description: text("description"),
//     coverImage: text("cover_image"),
//     isPublished: boolean("is_published").default(false),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const moduleActivities = pgTable("module_activities", {
//     moduleId: integer("module_id").references(() => modules.id),
//     activityId: integer("activity_id").references(() => activities.id),
//     order: integer("order").notNull().default(1),
// });

// export const assignments = pgTable("assignments", {
//     id: serial("id").primaryKey(),
//     activityId: integer("activity_id")
//         .references(() => activities.id)
//         .notNull(),
//     assignedBy: integer("assigned_by")
//         .references(() => users.id)
//         .notNull(),
//     dueDate: timestamp("due_date"),
//     instructions: text("instructions"),
//     rubricId: integer("rubric_id").references(() => rubrics.id),
//     isChallenge: boolean("is_challenge").default(false),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const rubrics = pgTable("rubrics", {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 255 }).notNull(),
//     description: text("description"),
//     criteria: json("criteria").notNull(), // JSON structure for rubric criteria
//     maxScore: integer("max_score").notNull(),
//     createdBy: integer("created_by").references(() => users.id),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const submissions = pgTable("submissions", {
//     id: serial("id").primaryKey(),
//     assignmentId: integer("assignment_id")
//         .references(() => assignments.id)
//         .notNull(),
//     studentId: integer("student_id")
//         .references(() => users.id)
//         .notNull(),
//     textResponse: text("text_response"),
//     audioUrl: text("audio_url"),
//     videoUrl: text("video_url"),
//     documentUrl: text("document_url"),
//     isDraft: boolean("is_draft").default(false),
//     submittedAt: timestamp("submitted_at").defaultNow(),
//     revisedAt: timestamp("revised_at"),
// });

// export const evaluations = pgTable("evaluations", {
//     id: serial("id").primaryKey(),
//     submissionId: integer("submission_id")
//         .references(() => submissions.id)
//         .notNull(),
//     evaluatorId: integer("evaluator_id")
//         .references(() => users.id)
//         .notNull(),
//     rubricId: integer("rubric_id")
//         .references(() => rubrics.id)
//         .notNull(),
//     scores: json("scores").notNull(), // JSON structure for scores per criteria
//     feedback: text("feedback"),
//     evaluatedAt: timestamp("evaluated_at").defaultNow(),
// });

// export const discussionThreads = pgTable("discussion_threads", {
//     id: serial("id").primaryKey(),
//     activityId: integer("activity_id").references(() => activities.id),
//     assignmentId: integer("assignment_id").references(() => assignments.id),
//     title: varchar("title", { length: 255 }).notNull(),
//     createdBy: integer("created_by")
//         .references(() => users.id)
//         .notNull(),
//     createdAt: timestamp("created_at").defaultNow(),
//     updatedAt: timestamp("updated_at").defaultNow(),
// });

// // export const discussionPosts = pgTable("discussion_posts", {
// //     id: serial("id").primaryKey(),
// //     threadId: integer("thread_id")
// //         .references(() => discussionThreads.id)
// //         .notNull(),
// //     authorId: integer("author_id")
// //         .references(() => users.id)
// //         .notNull(),
// //     content: text("content").notNull(),
// //     parentId: integer("parent_id").references(() => discussionPosts.id),
// //     createdAt: timestamp("created_at").defaultNow(),
// //     updatedAt: timestamp("updated_at").defaultNow(),
// // });

// export const weeklyChallenges = pgTable("weekly_challenges", {
//     id: serial("id").primaryKey(),
//     title: varchar("title", { length: 255 }).notNull(),
//     description: text("description").notNull(),
//     startDate: timestamp("start_date").notNull(),
//     endDate: timestamp("end_date").notNull(),
//     activityId: integer("activity_id")
//         .references(() => activities.id)
//         .notNull(),
//     rewardPoints: integer("reward_points").notNull().default(100),
//     badgeImage: text("badge_image"),
//     createdAt: timestamp("created_at").defaultNow(),
// });

// export const userProgress = pgTable("user_progress", {
//     id: serial("id").primaryKey(),
//     userId: integer("user_id")
//         .references(() => users.id)
//         .notNull(),
//     hotsType: varchar("hots_type", { length: 50 }).notNull(), // 'analyze', 'evaluate', etc.
//     skill: varchar("skill", { length: 20 }).notNull(), // 'reading', 'listening', etc.
//     completedActivities: integer("completed_activities").default(0),
//     averageScore: integer("average_score").default(0),
//     lastUpdated: timestamp("last_updated").defaultNow(),
// });

// export const userBadges = pgTable("user_badges", {
//     id: serial("id").primaryKey(),
//     userId: integer("user_id")
//         .references(() => users.id)
//         .notNull(),
//     badgeId: varchar("badge_id", { length: 100 }).notNull(),
//     earnedAt: timestamp("earned_at").defaultNow(),
// });

// export const userPoints = pgTable("user_points", {
//     userId: integer("user_id")
//         .references(() => users.id)
//         .primaryKey(),
//     totalPoints: integer("total_points").default(0),
//     streakDays: integer("streak_days").default(0),
//     lastActive: timestamp("last_active").defaultNow(),
// });

// // export const usersRelations = relations(users, ({ many }) => ({
// //     activities: many(activities),
// //     assignments: many(assignments),
// //     submissions: many(submissions),
// //     evaluations: many(evaluations),
// //     discussionThreads: many(discussionThreads),
// //     discussionPosts: many(discussionPosts),
// //     badges: many(userBadges),
// // }));

// export const activitiesRelations = relations(activities, ({ one, many }) => ({
//     creator: one(users, {
//         fields: [activities.createdBy],
//         references: [users.id],
//     }),
//     moduleActivities: many(moduleActivities),
//     assignments: many(assignments),
//     discussionThreads: many(discussionThreads),
// }));
