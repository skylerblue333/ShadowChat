CREATE TABLE `code_listings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`code` text NOT NULL,
	`language` varchar(50) DEFAULT 'typescript',
	`category` varchar(100) NOT NULL,
	`price` decimal(18,8) NOT NULL,
	`currency` varchar(10) DEFAULT 'SKY444',
	`rating` decimal(3,2) DEFAULT '0',
	`reviews` int DEFAULT 0,
	`downloads` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `code_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `code_reviews` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`listing_id` bigint NOT NULL,
	`reviewer_id` bigint NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `code_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `code_sales` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`listing_id` bigint NOT NULL,
	`buyer_id` bigint NOT NULL,
	`seller_id` bigint NOT NULL,
	`amount` decimal(18,8) NOT NULL,
	`currency` varchar(10) DEFAULT 'SKY444',
	`seller_royalty` decimal(18,8) NOT NULL,
	`platform_fee` decimal(18,8) NOT NULL,
	`status` varchar(20) DEFAULT 'completed',
	`transaction_hash` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `code_sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `collaborative_sessions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`session_id` varchar(255) NOT NULL,
	`participants` json,
	`code_content` text,
	`language` varchar(50) DEFAULT 'typescript',
	`started_at` timestamp DEFAULT (now()),
	`ended_at` timestamp,
	`status` varchar(20) DEFAULT 'active',
	CONSTRAINT `collaborative_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `collaborative_sessions_session_id_unique` UNIQUE(`session_id`)
);
--> statement-breakpoint
CREATE TABLE `nft_auctions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nft_id` bigint NOT NULL,
	`creator_id` bigint NOT NULL,
	`start_price` decimal(18,8) NOT NULL,
	`current_bid` decimal(18,8) NOT NULL,
	`highest_bidder_id` bigint,
	`end_date` date NOT NULL,
	`currency` varchar(50) DEFAULT 'SKY444',
	`status` varchar(20) DEFAULT 'active',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `nft_auctions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_listings` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`creator_id` bigint NOT NULL,
	`owner_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`image_url` varchar(500),
	`rarity` varchar(20) DEFAULT 'common',
	`attributes` json,
	`price` decimal(18,8),
	`currency` varchar(50) DEFAULT 'SKY444',
	`status` varchar(20) DEFAULT 'owned',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `nft_listings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `nft_transactions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`nft_id` bigint NOT NULL,
	`from_user_id` bigint NOT NULL,
	`to_user_id` bigint NOT NULL,
	`price` decimal(18,8),
	`currency` varchar(50) DEFAULT 'SKY444',
	`transaction_type` varchar(20) DEFAULT 'sale',
	`transaction_hash` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `nft_transactions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `performance_benchmarks` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`code_id` bigint NOT NULL,
	`execution_time` decimal(10,4) NOT NULL,
	`memory_usage` decimal(10,2) NOT NULL,
	`cpu_usage` decimal(5,2) NOT NULL,
	`optimization_score` int NOT NULL,
	`suggestions` json,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `performance_benchmarks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_tournament_scores` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`tournament_id` bigint NOT NULL,
	`user_id` bigint NOT NULL,
	`referrals` int DEFAULT 0,
	`conversions` int DEFAULT 0,
	`score` int DEFAULT 0,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `referral_tournament_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_tournaments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`start_date` date NOT NULL,
	`end_date` date NOT NULL,
	`prize_pool` decimal(18,8) NOT NULL,
	`prize_token` varchar(50) DEFAULT 'SKY444',
	`status` varchar(20) DEFAULT 'active',
	`creator_id` bigint NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `referral_tournaments_id` PRIMARY KEY(`id`)
);
