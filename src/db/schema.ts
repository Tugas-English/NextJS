import {
    pgTable,
    serial,
    text,
    timestamp,
    integer,
    boolean,
    json,
    varchar,
    decimal,
    unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    password: varchar("password", { length: 255 }),
    role: varchar("role", { length: 20 }).notNull().default("student"), // 'student', 'teacher', 'admin'
    avatarUrl: text("avatar_url"),
    googleId: varchar("google_id", { length: 255 }).unique(),
    isActive: boolean("is_active").default(true),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at")
        .defaultNow()
        .$onUpdate(() => new Date()),
});

export const activities = pgTable("activities", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    skill: varchar("skill", { length: 20 }).notNull(), // 'reading', 'listening', 'writing', 'speaking'
    hotsType: varchar("hots_type", { length: 50 }).notNull(), // 'analyze', 'evaluate', 'create', 'problem-solve', 'infer'
    difficulty: integer("difficulty").notNull().default(1), // 1-5
    estimatedDuration: integer("estimated_duration"), // in minutes
    content: text("content"), // Main text content
    instructions: text("instructions"), // Step-by-step instructions
    scaffoldingSteps: json("scaffolding_steps"), // JSON array of guidance steps
    audioUrl: text("audio_url"), // URL for listening activities
    videoUrl: text("video_url"), // URL for video content
    attachmentUrls: json("attachment_urls"), // JSON array of additional files
    isPublished: boolean("is_published").default(false),
    tags: json("tags"), // JSON array for categorization
    createdBy: integer("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const modules = pgTable("modules", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    coverImage: text("cover_image"),
    skill: varchar("skill", { length: 20 }), // Optional filter by skill
    hotsType: varchar("hots_type", { length: 50 }), // Optional filter by HOTS type
    difficulty: integer("difficulty"), // Optional difficulty level
    isPublished: boolean("is_published").default(false),
    createdBy: integer("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const moduleActivities = pgTable("module_activities", {
    id: serial("id").primaryKey(),
    moduleId: integer("module_id")
        .references(() => modules.id)
        .notNull(),
    activityId: integer("activity_id")
        .references(() => activities.id)
        .notNull(),
    order: integer("order").notNull().default(1),
    isRequired: boolean("is_required").default(true),
});

export const rubrics = pgTable("rubrics", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    criteria: json("criteria").notNull(),
    /* JSON structure example:
    {
        "hots_integration": {
            "name": "HOTS Integration & Variety",
            "weight": 40,
            "levels": {
                "4": "Excellent integration",
                "3": "Good integration",
                "2": "Fair integration",
                "1": "Poor integration"
            }
        },
        "clarity_scaffolding": {
            "name": "Clarity & Scaffolding",
            "weight": 35,
            "levels": {...}
        },
        "content_quality": {
            "name": "Content Quality",
            "weight": 25,
            "levels": {...}
        }
    }
    */
    maxScore: integer("max_score").notNull().default(100),
    isDefault: boolean("is_default").default(false),
    createdBy: integer("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const assignments = pgTable("assignments", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    activityId: integer("activity_id").references(() => activities.id),
    moduleId: integer("module_id").references(() => modules.id), // Can be part of module or standalone
    assignedBy: integer("assigned_by")
        .references(() => users.id)
        .notNull(),
    assignedTo: json("assigned_to"), // JSON array of student IDs or "all"
    dueDate: timestamp("due_date"),
    instructions: text("instructions"),
    rubricId: integer("rubric_id")
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
    id: serial("id").primaryKey(),
    assignmentId: integer("assignment_id")
        .references(() => assignments.id)
        .notNull(),
    studentId: integer("student_id")
        .references(() => users.id)
        .notNull(),
    version: integer("version").notNull().default(1), // For resubmissions
    textResponse: text("text_response"),
    audioUrl: text("audio_url"),
    videoUrl: text("video_url"),
    documentUrls: json("document_urls"), // JSON array for multiple files
    checklist: json("checklist"), // JSON for scaffolding checklist completion
    isDraft: boolean("is_draft").default(false),
    submittedAt: timestamp("submitted_at"),
    revisedAt: timestamp("revised_at"),
    createdAt: timestamp("created_at").defaultNow(),
});

export const evaluations = pgTable("evaluations", {
    id: serial("id").primaryKey(),
    submissionId: integer("submission_id")
        .references(() => submissions.id)
        .notNull(),
    evaluatorId: integer("evaluator_id")
        .references(() => users.id)
        .notNull(),
    rubricId: integer("rubric_id")
        .references(() => rubrics.id)
        .notNull(),
    scores: json("scores").notNull(),
    /* JSON structure example:
    {
        "hots_integration": 85,
        "clarity_scaffolding": 78,
        "content_quality": 92,
        "total": 85
    }
    */
    criteriaFeedback: json("criteria_feedback"), // Feedback per criteria
    generalFeedback: text("general_feedback"),
    isAutoGenerated: boolean("is_auto_generated").default(false),
    evaluatedAt: timestamp("evaluated_at").defaultNow(),
});

export const discussionThreads = pgTable("discussion_threads", {
    id: serial("id").primaryKey(),
    activityId: integer("activity_id").references(() => activities.id),
    assignmentId: integer("assignment_id").references(() => assignments.id),
    moduleId: integer("module_id").references(() => modules.id),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    isPinned: boolean("is_pinned").default(false),
    isLocked: boolean("is_locked").default(false),
    createdBy: integer("created_by")
        .references(() => users.id)
        .notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const discussionPosts = pgTable("discussion_posts", {
    id: serial("id").primaryKey(),
    threadId: integer("thread_id")
        .references(() => discussionThreads.id)
        .notNull(),
    authorId: integer("author_id")
        .references(() => users.id)
        .notNull(),
    content: text("content").notNull(),
    parentId: integer("parent_id").references(() => discussionPosts.id),
    attachmentUrls: json("attachment_urls"),
    likesCount: integer("likes_count").default(0),
    isEdited: boolean("is_edited").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export const postLikes = pgTable(
    "post_likes",
    {
        id: serial("id").primaryKey(),
        postId: integer("post_id")
            .references(() => discussionPosts.id)
            .notNull(),
        userId: integer("user_id")
            .references(() => users.id)
            .notNull(),
        createdAt: timestamp("created_at").defaultNow(),
    },
    (table) => ({
        uniqueUserPost: unique().on(table.userId, table.postId),
    })
);

export const weeklyChallenges = pgTable("weekly_challenges", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    skill: varchar("skill", { length: 20 }), // Optional skill focus
    hotsType: varchar("hots_type", { length: 50 }), // Optional HOTS focus
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    activityId: integer("activity_id").references(() => activities.id),
    assignmentId: integer("assignment_id").references(() => assignments.id),
    rewardPoints: integer("reward_points").notNull().default(100),
    badgeImage: text("badge_image"),
    participantCount: integer("participant_count").default(0),
    isActive: boolean("is_active").default(true),
    createdBy: integer("created_by").references(() => users.id),
    createdAt: timestamp("created_at").defaultNow(),
});

export const challengeParticipants = pgTable(
    "challenge_participants",
    {
        id: serial("id").primaryKey(),
        challengeId: integer("challenge_id")
            .references(() => weeklyChallenges.id)
            .notNull(),
        userId: integer("user_id")
            .references(() => users.id)
            .notNull(),
        submissionId: integer("submission_id").references(() => submissions.id),
        points: integer("points").default(0),
        rank: integer("rank"),
        completedAt: timestamp("completed_at"),
        joinedAt: timestamp("joined_at").defaultNow(),
    },
    (table) => ({
        uniqueUserChallenge: unique().on(table.userId, table.challengeId),
    })
);

export const userProgress = pgTable(
    "user_progress",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id")
            .references(() => users.id)
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
    },
    (table) => ({
        uniqueUserSkillHots: unique().on(
            table.userId,
            table.skill,
            table.hotsType
        ),
    })
);

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

export const userBadges = pgTable(
    "user_badges",
    {
        id: serial("id").primaryKey(),
        userId: integer("user_id")
            .references(() => users.id)
            .notNull(),
        badgeId: varchar("badge_id", { length: 100 })
            .references(() => badges.id)
            .notNull(),
        earnedAt: timestamp("earned_at").defaultNow(),
    },
    (table) => ({
        uniqueUserBadge: unique().on(table.userId, table.badgeId),
    })
);

export const userPoints = pgTable("user_points", {
    userId: integer("user_id")
        .references(() => users.id)
        .primaryKey(),
    totalPoints: integer("total_points").default(0),
    monthlyPoints: integer("monthly_points").default(0),
    weeklyPoints: integer("weekly_points").default(0),
    streakDays: integer("streak_days").default(0),
    longestStreak: integer("longest_streak").default(0),
    lastActive: timestamp("last_active").defaultNow(),
    lastStreakDate: timestamp("last_streak_date"),
});

export const activityFilters = pgTable("activity_filters", {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
        .references(() => users.id)
        .notNull(),
    skills: json("skills"), // JSON array of selected skills
    hotsTypes: json("hots_types"), // JSON array of selected HOTS types
    difficulties: json("difficulties"), // JSON array of selected difficulties
    isDefault: boolean("is_default").default(false),
    name: varchar("name", { length: 100 }), // Named filter sets
    createdAt: timestamp("created_at").defaultNow(),
});

export const reportExports = pgTable("report_exports", {
    id: serial("id").primaryKey(),
    generatedBy: integer("generated_by")
        .references(() => users.id)
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
export const usersRelations = relations(users, ({ many }) => ({
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
    creator: one(users, {
        fields: [activities.createdBy],
        references: [users.id],
    }),
    moduleActivities: many(moduleActivities),
    assignments: many(assignments),
    discussionThreads: many(discussionThreads),
    weeklyChallenges: many(weeklyChallenges),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
    creator: one(users, {
        fields: [modules.createdBy],
        references: [users.id],
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
    assignedBy: one(users, {
        fields: [assignments.assignedBy],
        references: [users.id],
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
    student: one(users, {
        fields: [submissions.studentId],
        references: [users.id],
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
        creator: one(users, {
            fields: [discussionThreads.createdBy],
            references: [users.id],
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
        author: one(users, {
            fields: [discussionPosts.authorId],
            references: [users.id],
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
        creator: one(users, {
            fields: [weeklyChallenges.createdBy],
            references: [users.id],
        }),
        participants: many(challengeParticipants),
    })
);
