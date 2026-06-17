CREATE TABLE `burningEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`amount` double NOT NULL,
	`reason` varchar(255),
	`supplyReduction` double NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `burningEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cryptoTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`type` enum('mining','staking_reward','swap','burn','transfer','receive') NOT NULL,
	`amount` double NOT NULL,
	`relatedId` int,
	`description` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cryptoTransactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cryptoWallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`balance` double NOT NULL DEFAULT 0,
	`stakedBalance` double NOT NULL DEFAULT 0,
	`totalMined` double NOT NULL DEFAULT 0,
	`totalBurned` double NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cryptoWallets_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `miningDifficulty` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`currentDifficulty` double NOT NULL,
	`targetDifficulty` double NOT NULL,
	`adjustmentFactor` double NOT NULL DEFAULT 1,
	`lastAdjustedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `miningDifficulty_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `miningOperations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`difficulty` double NOT NULL,
	`hashRate` double NOT NULL,
	`rewardAmount` double NOT NULL,
	`status` enum('active','completed','failed') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `miningOperations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `priceFeeds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`priceUsd` double NOT NULL,
	`priceChange24h` double NOT NULL,
	`marketCap` double,
	`volume24h` double,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `priceFeeds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stakingPositions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`amount` double NOT NULL,
	`apy` double NOT NULL,
	`lockPeriodDays` int NOT NULL,
	`rewardsClaimed` double NOT NULL DEFAULT 0,
	`status` enum('active','completed','unstaked') NOT NULL DEFAULT 'active',
	`startedAt` timestamp NOT NULL DEFAULT (now()),
	`unlocksAt` timestamp NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stakingPositions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `swapOrders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`fromToken` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`toToken` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`fromAmount` double NOT NULL,
	`toAmount` double NOT NULL,
	`exchangeRate` double NOT NULL,
	`slippage` double NOT NULL DEFAULT 0,
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `swapOrders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tokenSupply` (
	`id` int AUTO_INCREMENT NOT NULL,
	`token` enum('SKY444','DODGE','TRUMP','BTC','USDT','MONERO') NOT NULL,
	`totalSupply` double NOT NULL,
	`circulatingSupply` double NOT NULL,
	`burnedSupply` double NOT NULL DEFAULT 0,
	`stakedSupply` double NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tokenSupply_id` PRIMARY KEY(`id`)
);
