CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientId` text NOT NULL,
	`trainerId` text NOT NULL,
	`name` text NOT NULL,
	`notes` text,
	`location` text,
	`startTime` text NOT NULL,
	`endTime` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `chats` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`userId1` text NOT NULL,
	`userId2` text NOT NULL,
	FOREIGN KEY (`userId1`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId2`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `clients` (
	`id` text PRIMARY KEY NOT NULL,
	`trainerId` text NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dailies` (
	`activityId` integer PRIMARY KEY NOT NULL,
	`activeDays` text NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`chatId` integer NOT NULL,
	`senderId` text NOT NULL,
	`text` text NOT NULL,
	FOREIGN KEY (`chatId`) REFERENCES `chats`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `series` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`workoutId` integer NOT NULL,
	`index` integer NOT NULL,
	`reps` integer NOT NULL,
	FOREIGN KEY (`workoutId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sets` (
	`id` integer NOT NULL,
	`seriesId` integer NOT NULL,
	`integer` integer NOT NULL,
	`name` text NOT NULL,
	`reps` text,
	`weight` text,
	`duration` text,
	`rpe` text,
	FOREIGN KEY (`id`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `signupTokens` (
	`id` text PRIMARY KEY NOT NULL,
	`trainerId` text,
	`creationTimestamp` text NOT NULL,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `trainers` (
	`id` text PRIMARY KEY NOT NULL,
	FOREIGN KEY (`id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
CREATE TABLE `workouts` (
	`activityId` integer PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);