DROP TABLE IF EXISTS `sets`;
CREATE TABLE `sets` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`activityId` integer NOT NULL,
    `seriesId` integer,
	`index` integer NOT NULL,
	`exerciseName` text NOT NULL,
	`reps` text,
	`weight` text,
	`duration` text,
	`rpe` text,
	FOREIGN KEY (`seriesId`) REFERENCES `series`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`activityId`) REFERENCES `activities`(`id`) ON UPDATE no action ON DELETE cascade
);