CREATE TABLE `achievementBadges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`icon` text,
	`criteria` json,
	`rarity` enum('common','rare','epic','legendary') NOT NULL DEFAULT 'common',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `achievementBadges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `botPerformance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`botId` int NOT NULL,
	`userId` int NOT NULL,
	`date` date NOT NULL,
	`dailyPnl` double NOT NULL DEFAULT 0,
	`tradesExecuted` int NOT NULL DEFAULT 0,
	`winCount` int NOT NULL DEFAULT 0,
	`lossCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `botPerformance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `botTrades` (
	`id` int AUTO_INCREMENT NOT NULL,
	`botId` int NOT NULL,
	`userId` int NOT NULL,
	`entryPrice` double NOT NULL,
	`exitPrice` double,
	`quantity` double NOT NULL,
	`pnl` double NOT NULL DEFAULT 0,
	`status` enum('open','closed','cancelled') NOT NULL DEFAULT 'open',
	`enteredAt` timestamp NOT NULL DEFAULT (now()),
	`exitedAt` timestamp,
	CONSTRAINT `botTrades_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nftAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementType` varchar(100) NOT NULL,
	`tier` enum('bronze','silver','gold','platinum','diamond') NOT NULL DEFAULT 'bronze',
	`nftId` varchar(255),
	`mintedAt` timestamp,
	`expiresAt` timestamp,
	`metadata` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `nftAchievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `nftAchievements_nftId_unique` UNIQUE(`nftId`)
);
--> statement-breakpoint
CREATE TABLE `referralStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`totalReferrals` int NOT NULL DEFAULT 0,
	`activeReferrals` int NOT NULL DEFAULT 0,
	`totalRewardsEarned` double NOT NULL DEFAULT 0,
	`totalRewardsClaimed` double NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `referralStats_id` PRIMARY KEY(`id`),
	CONSTRAINT `referralStats_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int NOT NULL,
	`referralCode` varchar(50) NOT NULL,
	`status` enum('pending','active','completed') NOT NULL DEFAULT 'pending',
	`rewardAmount` double NOT NULL DEFAULT 0,
	`rewardToken` varchar(50) NOT NULL DEFAULT 'SKY444',
	`claimedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `tradingBots` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`strategy` enum('dca','grid','momentum','mean_reversion','arbitrage') NOT NULL,
	`status` enum('active','paused','stopped','error') NOT NULL DEFAULT 'paused',
	`baseToken` varchar(50) NOT NULL,
	`quoteToken` varchar(50) NOT NULL,
	`config` json,
	`capital` double NOT NULL,
	`profitLoss` double NOT NULL DEFAULT 0,
	`winRate` double NOT NULL DEFAULT 0,
	`totalTrades` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tradingBots_id` PRIMARY KEY(`id`)
);
