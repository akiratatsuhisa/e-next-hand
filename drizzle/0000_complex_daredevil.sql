CREATE TABLE `pass_keys` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`credential_id` text NOT NULL,
	`credential_public_key` text NOT NULL,
	`credentialTransports` json NOT NULL,
	`credential_counter` int NOT NULL DEFAULT 0,
	`credential_device_type` varchar(16) NOT NULL,
	`credential_backed_up` boolean NOT NULL,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `pass_keys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` bigint NOT NULL,
	`key` char(36) NOT NULL,
	`expires_at` datetime NOT NULL,
	`revoked_at` datetime,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`email` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`is_actived` boolean NOT NULL DEFAULT false,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pass_keys` ADD CONSTRAINT `pass_keys_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;