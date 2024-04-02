CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`clientId` text NOT NULL,
	`trainerId` text NOT NULL,
	`name` text,
	`notes` text,
	`location` text,
	`date` text NOT NULL,
	`startTime` text NOT NULL,
	`endTime` text NOT NULL,
	FOREIGN KEY (`clientId`) REFERENCES `clients`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`trainerId`) REFERENCES `trainers`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `dailies` (
	`activityId` integer PRIMARY KEY NOT NULL,
	`recurringDays` text NOT NULL,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
ALTER TABLE `sets` RENAME COLUMN `exerciseName` TO `integer`;--> statement-breakpoint
/*
 SQLite does not support "Dropping foreign key" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
/*
 SQLite does not support "Changing existing column type" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE series ADD `index` integer NOT NULL;--> statement-breakpoint
ALTER TABLE sets ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE users ADD `refreshToken` text;--> statement-breakpoint
ALTER TABLE workouts ADD `activityId` integer PRIMARY KEY NOT NULL REFERENCES activities(id);--> statement-breakpoint
CREATE UNIQUE INDEX `users_refreshToken_unique` ON `users` (`refreshToken`);--> statement-breakpoint
/*
 SQLite does not support "Creating foreign key on existing column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html

 Due to that we don't generate migration automatically and it has to be done manually
*/--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `id`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `clientId`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `trainerId`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `name`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `notes`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `startTimeDate`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `endTimeDate`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `recurringDays`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `location`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `remindMinsClient`;--> statement-breakpoint
ALTER TABLE `workouts` DROP COLUMN `remindMinsTrainer`;