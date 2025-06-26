import {
    pgTable,
    text,
    timestamp,
    integer,
    boolean,
    json,
    varchar,
    decimal,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const user = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    password: varchar("password", { length: 255 }),
    role: varchar("role", { length: 20 }).notNull().default("student"), // 'student', 'teacher', 'admin'
    image: text("avatar_url"),
    emailVerified: boolean("email_verified")
        .$defaultFn(() => false)
        .notNull(),
    provider: varchar("provider", { length: 20 })
        .notNull()
        .default("credentials"),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
    updatedAt: timestamp("updated_at")
        .$defaultFn(() => /* @__PURE__ */ new Date())
        .notNull(),
});

export const session = pgTable("session", {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
        .notNull()
        .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    ),
    updatedAt: timestamp("updated_at").$defaultFn(
        () => /* @__PURE__ */ new Date()
    ),
});

export const activities = pgTable("activities", {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    skill: varchar("skill", { length: 20 }).notNull(), // 'reading', 'listening', 'writing', 'speaking'
    hotsType: varchar("hots_type", { length: 50 }).notNull(), // 'analyze', 'evaluate', 'create', 'problem-solve', 'infer'
    difficulty: integer("difficulty").notNull().default(1), // 1-5
    estimatedDuration: integer("estimated_duration"),
    content: text("content"),
    instructions: text("instructions"),
    scaffoldingSteps: json("scaffolding_steps"),
    audioUrl: text("audio_url"),
    videoUrl: text("video_url"),
    attachmentUrls: json("attachment_urls"),
    isPublished: boolean("is_published").default(false),
    tags: json("tags"),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const modules = pgTable("modules", {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    coverImage: text("cover_image"),
    skill: varchar("skill", { length: 20 }),
    hotsType: varchar("hots_type", { length: 50 }),
    difficulty: integer("difficulty"),
    isPublished: boolean("is_published").default(false),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const moduleActivities = pgTable("module_activities", {
    id: text("id").primaryKey(),
    moduleId: text("module_id")
        .references(() => modules.id)
        .notNull(),
    activityId: text("activity_id")
        .references(() => activities.id)
        .notNull(),
    order: integer("order").notNull().default(1),
    isRequired: boolean("is_required").default(true),
});

export const rubrics = pgTable("rubrics", {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    criteria: json("criteria").notNull(),
    maxScore: integer("max_score").notNull().default(100),
    isDefault: boolean("is_default").default(false),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    activityId: text("activity_id").references(() => activities.id),
    moduleId: text("module_id").references(() => modules.id),
    assignedBy: text("assigned_by")
        .references(() => user.id)
        .notNull(),
    assignedTo: json("assigned_to"),
    dueDate: timestamp("due_date"),
    instructions: text("instructions"),
    rubricId: text("rubric_id")
        .references(() => rubrics.id)
        .notNull(),
    allowResubmission: boolean("allow_resubmission").default(true),
    maxResubmissions: integer("max_resubmissions").default(3),
    isChallenge: boolean("is_challenge").default(false),
    challengePoints: integer("challenge_points").default(0),
    isPublished: boolean("is_published").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const submissions = pgTable("submissions", {
    id: text("id").primaryKey(),
    assignmentId: text("assignment_id")
        .references(() => assignments.id)
        .notNull(),
    studentId: text("student_id")
        .references(() => user.id)
        .notNull(),
    version: integer("version").notNull().default(1),
    textResponse: text("text_response"),
    audioUrl: text("audio_url"),
    videoUrl: text("video_url"),
    documentUrls: json("document_urls"),
    checklist: json("checklist"),
    isDraft: boolean("is_draft").default(false),
    submittedAt: timestamp("submitted_at"),
    revisedAt: timestamp("revised_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const evaluations = pgTable("evaluations", {
    id: text("id").primaryKey(),
    submissionId: text("submission_id")
        .references(() => submissions.id)
        .notNull(),
    evaluatorId: text("evaluator_id")
        .references(() => user.id)
        .notNull(),
    rubricId: text("rubric_id")
        .references(() => rubrics.id)
        .notNull(),
    scores: json("scores").notNull(),
    criteriaFeedback: json("criteria_feedback"),
    generalFeedback: text("general_feedback"),
    isAutoGenerated: boolean("is_auto_generated").default(false),
    evaluatedAt: timestamp("evaluated_at").defaultNow(),
});

export const discussionThreads = pgTable("discussion_threads", {
    id: text("id").primaryKey(),
    activityId: text("activity_id").references(() => activities.id),
    assignmentId: text("assignment_id").references(() => assignments.id),
    moduleId: text("module_id").references(() => modules.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    isPinned: boolean("is_pinned").default(false),
    isLocked: boolean("is_locked").default(false),
    createdBy: text("created_by")
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const discussionPosts = pgTable("discussion_posts", {
    id: text("id").primaryKey(),
    threadId: text("thread_id")
        .references(() => discussionThreads.id)
        .notNull(),
    authorId: text("author_id")
        .references(() => user.id)
        .notNull(),
    content: text("content").notNull(),
    parentId: text("parent_id"),
    attachmentUrls: json("attachment_urls"),
    likesCount: integer("likes_count").default(0),
    isEdited: boolean("is_edited").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikes = pgTable("post_likes", {
    id: text("id").primaryKey(),
    postId: text("post_id")
        .references(() => discussionPosts.id)
        .notNull(),
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});

export const weeklyChallenges = pgTable("weekly_challenges", {
    id: text("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    skill: varchar("skill", { length: 20 }), // Optional skill focus
    hotsType: varchar("hots_type", { length: 50 }), // Optional HOTS focus
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    activityId: text("activity_id").references(() => activities.id),
    assignmentId: text("assignment_id").references(() => assignments.id),
    rewardPoints: integer("reward_points").notNull().default(100),
    badgeImage: text("badge_image"),
    participantCount: integer("participant_count").default(0),
    isActive: boolean("is_active").default(true),
    createdBy: text("created_by").references(() => user.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const challengeParticipants = pgTable("challenge_participants", {
    id: text("id").primaryKey(),
    challengeId: text("challenge_id")
        .references(() => weeklyChallenges.id)
        .notNull(),
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    submissionId: text("submission_id").references(() => submissions.id),
    points: integer("points").default(0),
    rank: integer("rank"),
    completedAt: timestamp("completed_at"),
    joinedAt: timestamp("joined_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    hotsType: varchar("hots_type", { length: 50 }).notNull(),
    skill: varchar("skill", { length: 20 }).notNull(),
    completedActivities: integer("completed_activities").default(0),
    averageScore: decimal("average_score", {
        precision: 5,
        scale: 2,
    }).default("0"),
    totalScore: integer("total_score").default(0),
    improvementRate: decimal("improvement_rate", {
        precision: 5,
        scale: 2,
    }).default("0"), // Percentage improvement
    lastActivityDate: timestamp("last_activity_date"),
    lastUpdated: timestamp("last_updated").defaultNow(),
});

export const badges = pgTable("badges", {
    id: varchar("id", { length: 100 }).primaryKey(), // e.g., "hots_master", "writing_expert"
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url"),
    category: varchar("category", { length: 50 }), // 'skill', 'hots', 'challenge', 'streak'
    criteria: json("criteria"), // Requirements to earn badge
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
});

export const userBadges = pgTable("user_badges", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    badgeId: varchar("badge_id", { length: 100 })
        .references(() => badges.id)
        .notNull(),
    earnedAt: timestamp("earned_at").defaultNow(),
});

export const userPoints = pgTable("user_points", {
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    totalPoints: integer("total_points").default(0),
    monthlyPoints: integer("monthly_points").default(0),
    weeklyPoints: integer("weekly_points").default(0),
    streakDays: integer("streak_days").default(0),
    longestStreak: integer("longest_streak").default(0),
    lastActive: timestamp("last_active").defaultNow(),
    lastStreakDate: timestamp("last_streak_date"),
});

export const activityFilters = pgTable("activity_filters", {
    id: text("id").primaryKey(),
    userId: text("user_id")
        .references(() => user.id)
        .notNull(),
    skills: json("skills"), // JSON array of selected skills
    hotsTypes: json("hots_types"), // JSON array of selected HOTS types
    difficulties: json("difficulties"), // JSON array of selected difficulties
    isDefault: boolean("is_default").default(false),
    name: varchar("name", { length: 100 }), // Named filter sets
    createdAt: timestamp("created_at").defaultNow(),
});

export const reportExports = pgTable("report_exports", {
    id: text("id").primaryKey(),
    generatedBy: text("generated_by")
        .references(() => user.id)
        .notNull(),
    type: varchar("type", { length: 50 }).notNull(), // 'student_progress', 'assignment_results', 'class_summary'
    filters: json("filters"), // Export parameters
    fileUrl: text("file_url"),
    format: varchar("format", { length: 10 }).default("pdf"), // 'pdf', 'excel', 'csv'
    status: varchar("status", { length: 20 }).default("processing"), // 'processing', 'completed', 'failed'
    createdAt: timestamp("created_at").defaultNow(),
    completedAt: timestamp("completed_at"),
});

// Relations
export const userRelations = relations(user, ({ many }) => ({
    activities: many(activities),
    assignments: many(assignments),
    submissions: many(submissions),
    evaluations: many(evaluations),
    discussionThreads: many(discussionThreads),
    discussionPosts: many(discussionPosts),
    badges: many(userBadges),
    progress: many(userProgress),
    challengeParticipations: many(challengeParticipants),
}));

export const activitiesRelations = relations(activities, ({ one, many }) => ({
    creator: one(user, {
        fields: [activities.createdBy],
        references: [user.id],
    }),
    moduleActivities: many(moduleActivities),
    assignments: many(assignments),
    discussionThreads: many(discussionThreads),
    weeklyChallenges: many(weeklyChallenges),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    creator: one(user, {
        fields: [modules.createdBy],
        references: [user.id],
    }),
    moduleActivities: many(moduleActivities),
    assignments: many(assignments),
    discussionThreads: many(discussionThreads),
}));

export const assignmentsRelations = relations(assignments, ({ one, many }) => ({
    activity: one(activities, {
        fields: [assignments.activityId],
        references: [activities.id],
    }),
    module: one(modules, {
        fields: [assignments.moduleId],
        references: [modules.id],
    }),
    assignedBy: one(user, {
        fields: [assignments.assignedBy],
        references: [user.id],
    }),
    rubric: one(rubrics, {
        fields: [assignments.rubricId],
        references: [rubrics.id],
    }),
    submissions: many(submissions),
    discussionThreads: many(discussionThreads),
}));

export const submissionsRelations = relations(submissions, ({ one, many }) => ({
    assignment: one(assignments, {
        fields: [submissions.assignmentId],
        references: [assignments.id],
    }),
    student: one(user, {
        fields: [submissions.studentId],
        references: [user.id],
    }),
    evaluations: many(evaluations),
}));

export const discussionThreadsRelations = relations(
    discussionThreads,
    ({ one, many }) => ({
        activity: one(activities, {
            fields: [discussionThreads.activityId],
            references: [activities.id],
        }),
        assignment: one(assignments, {
            fields: [discussionThreads.assignmentId],
            references: [assignments.id],
        }),
        module: one(modules, {
            fields: [discussionThreads.moduleId],
            references: [modules.id],
        }),
        creator: one(user, {
            fields: [discussionThreads.createdBy],
            references: [user.id],
        }),
        posts: many(discussionPosts),
    })
);

export const discussionPostsRelations = relations(
    discussionPosts,
    ({ one, many }) => ({
        thread: one(discussionThreads, {
            fields: [discussionPosts.threadId],
            references: [discussionThreads.id],
        }),
        author: one(user, {
            fields: [discussionPosts.authorId],
            references: [user.id],
        }),
        parent: one(discussionPosts, {
            fields: [discussionPosts.parentId],
            references: [discussionPosts.id],
        }),
        replies: many(discussionPosts),
        likes: many(postLikes),
    })
);

export const weeklyChallengesRelations = relations(
    weeklyChallenges,
    ({ one, many }) => ({
        activity: one(activities, {
            fields: [weeklyChallenges.activityId],
            references: [activities.id],
        }),
        assignment: one(assignments, {
            fields: [weeklyChallenges.assignmentId],
            references: [assignments.id],
        }),
        creator: one(user, {
            fields: [weeklyChallenges.createdBy],
            references: [user.id],
        }),
        participants: many(challengeParticipants),
    })
);
