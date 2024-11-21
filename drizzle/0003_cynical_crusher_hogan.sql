CREATE TABLE `product_attachments` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_id` bigint,
	`product_option_value_id` bigint,
	`product_variant_id` bigint,
	`is_main` boolean NOT NULL DEFAULT false,
	`media_path` varchar(255) NOT NULL,
	`media_type` varchar(64) NOT NULL DEFAULT 'image',
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `product_attachments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `product_variant_option_values` DROP FOREIGN KEY `product_variant_id_fk`;
--> statement-breakpoint
ALTER TABLE `product_variant_option_values` DROP FOREIGN KEY `product_option_value_id_fk`;
--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_variant_id_fk` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_option_value_id_fk` FOREIGN KEY (`product_option_value_id`) REFERENCES `product_option_values`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_variant_option_values` ADD CONSTRAINT `p_v_o_v_product_variant_id_fk` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_variant_option_values` ADD CONSTRAINT `p_v_o_v_product_option_value_id_fk` FOREIGN KEY (`product_option_value_id`) REFERENCES `product_option_values`(`id`) ON DELETE cascade ON UPDATE cascade;