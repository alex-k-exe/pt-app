-- Drop existing tables if they exist
DROP TABLE IF EXISTS `activities`;
CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientId` text NOT NULL,
	`trainerId` text NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`location` text,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `chats`;
CREATE TABLE `chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId1` text NOT NULL,
	`userId2` text NOT NULL,
	FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `clients`;
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`trainerId` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `dailies`;
CREATE TABLE `dailies` (
	`id` integer PRIMARY KEY NOT NULL,
	`activeDays` text DEFAULT '0000000' NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `messages`;
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sentTimestamp` text DEFAULT (CURRENT_TIMESTAMP),
	`chatId` integer NOT NULL,
	`senderId` text NOT NULL,
	`text` text NOT NULL,
	`readByReciever` integer DEFAULT false NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `series`;
CREATE TABLE `series` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activityId` integer NOT NULL,
	`index` integer NOT NULL,
	`reps` integer NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `sets`;
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`seriesId` integer NOT NULL,
	`index` integer NOT NULL,
	`exerciseName` text NOT NULL,
	`reps` text,
	`weight` text,
	`duration` text,
	`rpe` text,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `signupTokens`;
CREATE TABLE `signupTokens` (
	`id` integer PRIMARY KEY NOT NULL,
	`trainerId` text,
	`creationTimestamp` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `trainers`;
CREATE TABLE `trainers` (
	`id` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint

DROP TABLE IF EXISTS `workouts`;
CREATE TABLE `workouts` (
	`id` integer PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`startTime` text NOT NULL,
	`endTime` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint

-- Create unique index for users email
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
