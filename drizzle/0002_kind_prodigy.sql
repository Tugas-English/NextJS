CREATE TABLE "course_activities" (
	"id" text PRIMARY KEY NOT NULL,
	"course_id" text NOT NULL,
	"activity_id" text NOT NULL,
	"order" integer DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE "course_activities" ADD CONSTRAINT "course_activities_course_id_courses_id_fk" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "course_activities" ADD CONSTRAINT "course_activities_activity_id_activities_id_fk" FOREIGN KEY ("activity_id") REFERENCES "public"."activities"("id") ON DELETE no action ON UPDATE no action;