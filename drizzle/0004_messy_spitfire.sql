ALTER TABLE `addresses` MODIFY COLUMN `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `role` varchar(16) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `first_name` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `last_name` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(32);--> statement-breakpoint
ALTER TABLE `users` ADD `address` varchar(255);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `country_code` char(2);--> statement-breakpoint
ALTER TABLE `users` ADD `postal_code` varchar(32);