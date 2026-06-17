CREATE TABLE `escrowListings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sellerId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`imageUrl` text,
	`imageKey` varchar(512),
	`priceSky` double NOT NULL,
	`priceDodge` double NOT NULL,
	`priceTrump` double NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`category` varchar(100) NOT NULL,
	`status` enum('active','sold','delisted') NOT NULL DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `escrowListings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `escrowTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`buyerId` int NOT NULL,
	`sellerId` int NOT NULL,
	`listingId` int NOT NULL,
	`amount` double NOT NULL,
	`currency` enum('SKY444','DODGE','TRUMP') NOT NULL,
	`status` enum('pending','released','disputed','refunded') NOT NULL DEFAULT 'pending',
	`buyerConfirmed` boolean NOT NULL DEFAULT false,
	`sellerConfirmed` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `escrowTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`postId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `socialPosts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`imageUrl` text,
	`imageKey` varchar(512),
	`likes` int NOT NULL DEFAULT 0,
	`shares` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `socialPosts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tradeSessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`symbol` varchar(32) NOT NULL,
	`entryPrice` double NOT NULL,
	`exitPrice` double,
	`quantity` double NOT NULL,
	`profitLoss` double NOT NULL DEFAULT 0,
	`status` enum('open','closed') NOT NULL DEFAULT 'open',
	`aiSignalConfidence` double NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`closedAt` timestamp,
	CONSTRAINT `tradeSessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tradingSignals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`symbol` varchar(32) NOT NULL,
	`signal` enum('buy','sell','hold') NOT NULL,
	`confidence` double NOT NULL,
	`price` double NOT NULL,
	`prediction` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `tradingSignals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userFollows` (
	`id` int AUTO_INCREMENT NOT NULL,
	`followerId` int NOT NULL,
	`followingId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userFollows_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoComments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`videoId` int NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`likes` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoComments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `videoContent` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`videoUrl` text NOT NULL,
	`videoKey` varchar(512),
	`thumbnailUrl` text,
	`thumbnailKey` varchar(512),
	`category` varchar(100) NOT NULL,
	`views` int NOT NULL DEFAULT 0,
	`likes` int NOT NULL DEFAULT 0,
	`duration` int,
	`isLive` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `videoContent_id` PRIMARY KEY(`id`)
);
