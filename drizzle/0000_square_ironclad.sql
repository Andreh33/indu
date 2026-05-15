CREATE TABLE `admin_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`entity_type` text,
	`entity_id` text,
	`metadata` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`actor_id`) REFERENCES `admin_users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `admin_users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text,
	`first_login` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_users_email_unique` ON `admin_users` (`email`);--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`image_url` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_slug_unique` ON `categories` (`slug`);--> statement-breakpoint
CREATE TABLE `instagram_items` (
	`id` text PRIMARY KEY NOT NULL,
	`ig_id` text,
	`image_url` text NOT NULL,
	`caption` text,
	`permalink` text,
	`display_order` integer DEFAULT 0 NOT NULL,
	`is_manual` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `instagram_items_ig_id_unique` ON `instagram_items` (`ig_id`);--> statement-breakpoint
CREATE TABLE `order_attempts` (
	`id` text PRIMARY KEY NOT NULL,
	`items` text NOT NULL,
	`total_cents` integer NOT NULL,
	`ip_truncated` text,
	`user_agent` text,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_images` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`url` text NOT NULL,
	`cloudinary_public_id` text,
	`alt` text,
	`is_primary` integer DEFAULT false NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`name` text NOT NULL,
	`category_id` text NOT NULL,
	`type` text,
	`short_description` text,
	`long_description` text,
	`base_price_cents` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`available_sizes` text DEFAULT '[]' NOT NULL,
	`available_colors` text DEFAULT '[]' NOT NULL,
	`available_weights` text DEFAULT '[]' NOT NULL,
	`available_fits` text DEFAULT '[]' NOT NULL,
	`customization_config` text DEFAULT '{}' NOT NULL,
	`details` text DEFAULT '{}' NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`og_image_url` text,
	`related_product_ids` text DEFAULT '[]' NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE restrict
);
--> statement-breakpoint
CREATE UNIQUE INDEX `products_slug_unique` ON `products` (`slug`);--> statement-breakpoint
CREATE TABLE `settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text
);
--> statement-breakpoint
CREATE TABLE `work_images` (
	`id` text PRIMARY KEY NOT NULL,
	`work_id` text NOT NULL,
	`url` text NOT NULL,
	`cloudinary_public_id` text,
	`alt` text,
	`caption` text,
	`type` text NOT NULL,
	`display_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`work_id`) REFERENCES `works`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `works` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`client_name` text NOT NULL,
	`city` text,
	`year` integer,
	`type` text NOT NULL,
	`units` integer DEFAULT 1 NOT NULL,
	`brief` text,
	`process` text,
	`quote` text,
	`related_product_ids` text DEFAULT '[]' NOT NULL,
	`published` integer DEFAULT false NOT NULL,
	`published_at` integer,
	`display_order` integer DEFAULT 0 NOT NULL,
	`seo_title` text,
	`seo_description` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `works_slug_unique` ON `works` (`slug`);