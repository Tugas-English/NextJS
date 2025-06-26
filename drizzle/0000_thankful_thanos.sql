CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "activities" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"skill" varchar(20) NOT NULL,
	"hots_type" varchar(50) NOT NULL,
	"difficulty" integer DEFAULT 1 NOT NULL,
	"estimated_duration" integer,
	"content" text,
	"instructions" text,
	"scaffolding_steps" json,
	"audio_url" text,
	"video_url" text,
	"attachment_urls" json,
	"is_published" boolean DEFAULT false,
	"tags" json,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "activity_filters" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"skills" json,
	"hots_types" json,
	"difficulties" json,
	"is_default" boolean DEFAULT false,
	"name" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "assignments" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"activity_id" text,
	"module_id" text,
	"assigned_by" text NOT NULL,
	"assigned_to" json,
	"due_date" timestamp,
	"instructions" text,
	"rubric_id" text NOT NULL,
	"allow_resubmission" boolean DEFAULT true,
	"max_resubmissions" integer DEFAULT 3,
	"is_challenge" boolean DEFAULT false,
	"challenge_points" integer DEFAULT 0,
	"is_published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "badges" (
	"id" varchar(100) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"category" varchar(50),
	"criteria" json,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" text PRIMARY KEY NOT NULL,
	"challenge_id" text NOT NULL,
	"user_id" text NOT NULL,
	"submission_id" text,
	"points" integer DEFAULT 0,
	"rank" integer,
	"completed_at" timestamp,
	"joined_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discussion_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"author_id" text NOT NULL,
	"content" text NOT NULL,
	"parent_id" text,
	"attachment_urls" json,
	"likes_count" integer DEFAULT 0,
	"is_edited" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "discussion_threads" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_id" text,
	"assignment_id" text,
	"module_id" text,
	"title" varchar(255) NOT NULL,
	"description" text,
	"is_pinned" boolean DEFAULT false,
	"is_locked" boolean DEFAULT false,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "evaluations" (
	"id" text PRIMARY KEY NOT NULL,
	"submission_id" text NOT NULL,
	"evaluator_id" text NOT NULL,
	"rubric_id" text NOT NULL,
	"scores" json NOT NULL,
	"criteria_feedback" json,
	"general_feedback" text,
	"is_auto_generated" boolean DEFAULT false,
	"evaluated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "module_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"module_id" text NOT NULL,
	"activity_id" text NOT NULL,
	"order" integer DEFAULT 1 NOT NULL,
	"is_required" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "modules" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"cover_image" text,
	"skill" varchar(20),
	"hots_type" varchar(50),
	"difficulty" integer,
	"is_published" boolean DEFAULT false,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post_likes" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "report_exports" (
	"id" text PRIMARY KEY NOT NULL,
	"generated_by" text NOT NULL,
	"type" varchar(50) NOT NULL,
	"filters" json,
	"file_url" text,
	"format" varchar(10) DEFAULT 'pdf',
	"status" varchar(20) DEFAULT 'processing',
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "rubrics" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"criteria" json NOT NULL,
	"max_score" integer DEFAULT 100 NOT NULL,
	"is_default" boolean DEFAULT false,
	"created_by" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" text PRIMARY KEY NOT NULL,
	"assignment_id" text NOT NULL,
	"student_id" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"text_response" text,
	"audio_url" text,
	"video_url" text,
	"document_urls" json,
	"checklist" json,
	"is_draft" boolean DEFAULT false,
	"submitted_at" timestamp,
	"revised_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password" varchar(255),
	"role" varchar(20) DEFAULT 'student' NOT NULL,
	"avatar_url" text,
	"email_verified" boolean NOT NULL,
	"provider" varchar(20) DEFAULT 'credentials' NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user_badges" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"badge_id" varchar(100) NOT NULL,
	"earned_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_points" (
	"user_id" text NOT NULL,
	"total_points" integer DEFAULT 0,
	"monthly_points" integer DEFAULT 0,
	"weekly_points" integer DEFAULT 0,
	"streak_days" integer DEFAULT 0,
	"longest_streak" integer DEFAULT 0,
	"last_active" timestamp DEFAULT now(),
	"last_streak_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"hots_type" varchar(50) NOT NULL,
	"skill" varchar(20) NOT NULL,
	"completed_activities" integer DEFAULT 0,
	"average_score" numeric(5, 2) DEFAULT '0',
	"total_score" integer DEFAULT 0,
	"improvement_rate" numeric(5, 2) DEFAULT '0',
	"last_activity_date" timestamp,
	"last_updated" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "weekly_challenges" (
	"id" text PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"skill" varchar(20),
	"hots_type" varchar(50),
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"activity_id" text,
	"assignment_id" text,
	"reward_points" integer DEFAULT 100 NOT NULL,
	"badge_image" text,
	"participant_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_by" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activities" ADD CONSTRAINT "activities_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_filters" ADD CONSTRAINT "activity_filters_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_assigned_by_user_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assignments" ADD CONSTRAINT "assignments_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_challenge_id_weekly_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."weekly_challenges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_participants" ADD CONSTRAINT "challenge_participants_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_posts" ADD CONSTRAINT "discussion_posts_thread_id_discussion_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."discussion_threads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_posts" ADD CONSTRAINT "discussion_posts_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discussion_threads" ADD CONSTRAINT "discussion_threads_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_evaluator_id_user_id_fk" FOREIGN KEY ("evaluator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_rubric_id_rubrics_id_fk" FOREIGN KEY ("rubric_id") REFERENCES "public"."rubrics"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_activities" ADD CONSTRAINT "module_activities_module_id_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."modules"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "module_activities" ADD CONSTRAINT "module_activities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "modules" ADD CONSTRAINT "modules_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_post_id_discussion_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."discussion_posts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_likes" ADD CONSTRAINT "post_likes_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "report_exports" ADD CONSTRAINT "report_exports_generated_by_user_id_fk" FOREIGN KEY ("generated_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rubrics" ADD CONSTRAINT "rubrics_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_student_id_user_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_badges" ADD CONSTRAINT "user_badges_badge_id_badges_id_fk" FOREIGN KEY ("badge_id") REFERENCES "public"."badges"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_points" ADD CONSTRAINT "user_points_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_challenges" ADD CONSTRAINT "weekly_challenges_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_challenges" ADD CONSTRAINT "weekly_challenges_assignment_id_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."assignments"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_challenges" ADD CONSTRAINT "weekly_challenges_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;