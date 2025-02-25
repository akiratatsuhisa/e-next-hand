CREATE TABLE `addresses` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`first_name` varchar(128),
	`last_name` varchar(128),
	`email` varchar(255),
	`phone` varchar(32),
	`address` varchar(255),
	`city` varchar(128),
	`country_code` char(2),
	`postal_code` varchar(32),
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `addresses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`order_id` bigint NOT NULL,
	`product_variant_id` bigint NOT NULL,
	`quantity` int unsigned NOT NULL DEFAULT 1,
	`unit_price` decimal(15,2) NOT NULL DEFAULT '0',
	`discount_amount` decimal(15,2) NOT NULL DEFAULT '0',
	`tax_amount` decimal(15,2) NOT NULL DEFAULT '0',
	`total_price` decimal(15,2) NOT NULL DEFAULT '0',
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`user_id` varchar(255),
	`order_number` char(20) NOT NULL,
	`status` varchar(16) NOT NULL DEFAULT 'pending',
	`payment_method` varchar(16) NOT NULL DEFAULT 'paypal',
	`payment_status` varchar(16) NOT NULL DEFAULT 'unpaid',
	`shipping_address_id` bigint NOT NULL,
	`billing_address_id` bigint NOT NULL,
	`discount_amount` decimal(15,2) NOT NULL DEFAULT '0',
	`tax_amount` decimal(15,2) NOT NULL DEFAULT '0',
	`shipping_fee` decimal(15,2) NOT NULL DEFAULT '0',
	`total_price` decimal(15,2) NOT NULL DEFAULT '0',
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `product_option_values` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_option_id` bigint NOT NULL,
	`value` varchar(255) NOT NULL,
	`sort_order` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `product_option_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `product_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_variant_option_values` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_variant_id` bigint NOT NULL,
	`product_option_value_id` bigint NOT NULL,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `product_variant_option_values_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `product_variants` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`product_id` bigint NOT NULL,
	`sku` varchar(255) NOT NULL,
	`original_price` decimal(15,2),
	`price` decimal(15,2) NOT NULL,
	`stock` int unsigned NOT NULL DEFAULT 0,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `product_variants_id` PRIMARY KEY(`id`),
	CONSTRAINT `product_variants_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`category_id` bigint NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`created_at` datetime NOT NULL DEFAULT NOW(),
	`created_by` bigint NOT NULL,
	`updated_at` datetime NOT NULL DEFAULT NOW(),
	`updated_by` bigint NOT NULL,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_orders_id_fk` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_variant_id_product_variants_id_fk` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_shipping_address_id_addresses_id_fk` FOREIGN KEY (`shipping_address_id`) REFERENCES `addresses`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `orders` ADD CONSTRAINT `orders_billing_address_id_addresses_id_fk` FOREIGN KEY (`billing_address_id`) REFERENCES `addresses`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_variant_id_fk` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_attachments` ADD CONSTRAINT `p_a_product_option_value_id_fk` FOREIGN KEY (`product_option_value_id`) REFERENCES `product_option_values`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_option_values` ADD CONSTRAINT `product_option_values_product_option_id_product_options_id_fk` FOREIGN KEY (`product_option_id`) REFERENCES `product_options`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_options` ADD CONSTRAINT `product_options_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_variant_option_values` ADD CONSTRAINT `p_v_o_v_product_variant_id_fk` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variants`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_variant_option_values` ADD CONSTRAINT `p_v_o_v_product_option_value_id_fk` FOREIGN KEY (`product_option_value_id`) REFERENCES `product_option_values`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `product_variants` ADD CONSTRAINT `product_variants_product_id_products_id_fk` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_categories_id_fk` FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON DELETE cascade ON UPDATE cascade;