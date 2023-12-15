DROP TABLE IF EXISTS children;
CREATE TABLE IF NOT EXISTS `children` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`presentsWeight` real NOT NULL
);