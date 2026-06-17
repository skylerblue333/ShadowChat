CREATE TABLE `agent_analytics` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`agent_id` bigint NOT NULL,
	`daily_tasks` int DEFAULT 0,
	`daily_success` int DEFAULT 0,
	`average_execution_time` decimal(10,2) DEFAULT '0',
	`total_earnings` decimal(18,8) DEFAULT '0',
	`date` date NOT NULL,
	CONSTRAINT `agent_analytics_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `agent_tasks` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`agent_id` bigint NOT NULL,
	`user_id` bigint NOT NULL,
	`task_type` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`input` json,
	`output` json,
	`status` varchar(50) DEFAULT 'pending',
	`result` text,
	`execution_time` int,
	`created_at` timestamp DEFAULT (now()),
	`completed_at` timestamp,
	CONSTRAINT `agent_tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `ai_agents` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`type` varchar(100) NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`description` text,
	`capabilities` json DEFAULT ('[]'),
	`performance_score` decimal(5,2) DEFAULT '0',
	`tasks_completed` int DEFAULT 0,
	`success_rate` decimal(5,2) DEFAULT '0',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `ai_agents_id` PRIMARY KEY(`id`)
);
