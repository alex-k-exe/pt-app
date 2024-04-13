DROP TABLE IF EXISTS `activities`;
DROP TABLE IF EXISTS `chats`;
DROP TABLE IF EXISTS `clients`;
DROP TABLE IF EXISTS `dailies`;
DROP TABLE IF EXISTS `messages`;
DROP TABLE IF EXISTS `series`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `sets`;
DROP TABLE IF EXISTS `signupTokens`;
DROP TABLE IF EXISTS `trainers`;
DROP TABLE IF EXISTS `users`;
DROP TABLE IF EXISTS `workouts`;

CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientId` text NOT NULL,
	`trainerId` text NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`location` text,
	`startTime` integer NOT NULL,
	`endTime` integer NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId1` text NOT NULL,
	`userId2` text NOT NULL,
	FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`trainerId` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dailies` (
	`activityId` integer PRIMARY KEY NOT NULL,
	`activeDays` text NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
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
CREATE TABLE `series` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activityId` integer NOT NULL,
	`index` integer NOT NULL,
	`reps` integer NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activityId` integer NOT NULL,
	`seriesId` integer NOT NULL,
	`index` integer NOT NULL,
	`exerciseName` text NOT NULL,
	`reps` text,
	`weight` text,
	`duration` text,
	`rpe` text,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `signupTokens` (
	`id` integer PRIMARY KEY NOT NULL,
	`trainerId` text,
	`creationTimestamp` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `trainers` (
	`id` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`activityId` integer PRIMARY KEY NOT NULL,
	`date` integer NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);