CREATE TABLE `competition_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`competition_id` int NOT NULL,
	`user_id` int NOT NULL,
	`score` double NOT NULL,
	`rank` int,
	`prize_earned` double,
	`claimed_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `competition_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `push_notifications_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`action_url` varchar(500),
	`is_read` boolean DEFAULT false,
	`read_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `push_notifications_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referral_rewards_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrer_id` int NOT NULL,
	`referred_id` int NOT NULL,
	`reward_amount` double NOT NULL,
	`reward_token` varchar(50) NOT NULL,
	`status` enum('pending','claimed','expired') NOT NULL,
	`claimed_at` timestamp,
	`expires_at` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `referral_rewards_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `seasonal_competitions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` varchar(50) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`prize_pool` double NOT NULL,
	`prize_token` varchar(50) NOT NULL,
	`status` enum('active','completed') NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `seasonal_competitions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_analytics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`feature_name` varchar(255) NOT NULL,
	`action_type` varchar(50) NOT NULL,
	`duration` int,
	`timestamp` timestamp NOT NULL,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_analytics_id` PRIMARY KEY(`id`)
);
