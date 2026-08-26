CREATE TABLE `trades` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`direction` text NOT NULL,
	`entryTime` integer NOT NULL,
	`exitTime` integer NOT NULL,
	`entryPrice` real NOT NULL,
	`exitPrice` real NOT NULL,
	`contracts` integer NOT NULL,
	`pointValue` real DEFAULT 5 NOT NULL,
	`setup` text,
	`notes` text,
	`createdAt` integer DEFAULT (unixepoch()) NOT NULL
);
