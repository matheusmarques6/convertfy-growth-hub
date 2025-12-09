-- Migration: Billing & Payments System
-- Created: 2025-12-07
-- Description: Creates tables for plans, subscriptions, and invoices

-- ===================================================
-- TABLE: plans
-- Purpose: Store subscription plans available for users
-- ===================================================
CREATE TABLE IF NOT EXISTS `plans` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `plan_id` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'BRL',
  `interval` ENUM('monthly', 'yearly') NOT NULL DEFAULT 'monthly',
  `features` LONGTEXT,
  `limits` LONGTEXT,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `stripe_price_id` VARCHAR(255),
  `pagarme_id` VARCHAR(255),
  `display_order` INT(11) DEFAULT 0,
  `is_popular` TINYINT(1) DEFAULT 0,
  `trial_days` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: subscriptions
-- Purpose: Track user subscriptions to plans
-- ===================================================
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `subscription_id` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` INT(11) NOT NULL,
  `user_uid` VARCHAR(255) NOT NULL,
  `plan_id` VARCHAR(100) NOT NULL,
  `status` ENUM('active', 'canceled', 'past_due', 'trialing', 'incomplete', 'incomplete_expired', 'unpaid') NOT NULL DEFAULT 'active',
  `current_period_start` DATETIME NOT NULL,
  `current_period_end` DATETIME NOT NULL,
  `cancel_at_period_end` TINYINT(1) NOT NULL DEFAULT 0,
  `canceled_at` DATETIME,
  `stripe_subscription_id` VARCHAR(255),
  `stripe_customer_id` VARCHAR(255),
  `pagarme_subscription_id` VARCHAR(255),
  `pagarme_customer_id` VARCHAR(255),
  `trial_start` DATETIME,
  `trial_end` DATETIME,
  `metadata` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_subscription_id` (`subscription_id`),
  KEY `idx_user_uid` (`user_uid`),
  KEY `idx_plan_id` (`plan_id`),
  KEY `idx_status` (`status`),
  FOREIGN KEY (`plan_id`) REFERENCES `plans` (`plan_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: invoices
-- Purpose: Store payment invoices and transaction history
-- ===================================================
CREATE TABLE IF NOT EXISTS `invoices` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `invoice_id` VARCHAR(100) NOT NULL UNIQUE,
  `subscription_id` VARCHAR(100) NOT NULL,
  `user_uid` VARCHAR(255) NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `currency` VARCHAR(3) NOT NULL DEFAULT 'BRL',
  `status` ENUM('paid', 'pending', 'failed', 'refunded', 'canceled') NOT NULL DEFAULT 'pending',
  `invoice_url` TEXT,
  `invoice_pdf` TEXT,
  `stripe_invoice_id` VARCHAR(255),
  `stripe_payment_intent_id` VARCHAR(255),
  `pagarme_invoice_id` VARCHAR(255),
  `pagarme_charge_id` VARCHAR(255),
  `payment_method` VARCHAR(50),
  `paid_at` DATETIME,
  `due_date` DATETIME,
  `attempt_count` INT(11) DEFAULT 0,
  `last_attempt_at` DATETIME,
  `error_message` TEXT,
  `metadata` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_invoice_id` (`invoice_id`),
  KEY `idx_subscription_id` (`subscription_id`),
  KEY `idx_user_uid` (`user_uid`),
  KEY `idx_status` (`status`),
  KEY `idx_paid_at` (`paid_at`),
  FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`subscription_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: payment_methods
-- Purpose: Store user payment methods (cards, etc)
-- ===================================================
CREATE TABLE IF NOT EXISTS `payment_methods` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `payment_method_id` VARCHAR(100) NOT NULL UNIQUE,
  `user_uid` VARCHAR(255) NOT NULL,
  `type` ENUM('card', 'boleto', 'pix', 'bank_transfer') NOT NULL DEFAULT 'card',
  `stripe_payment_method_id` VARCHAR(255),
  `pagarme_card_id` VARCHAR(255),
  `is_default` TINYINT(1) DEFAULT 0,
  `card_brand` VARCHAR(50),
  `card_last4` VARCHAR(4),
  `card_exp_month` INT(2),
  `card_exp_year` INT(4),
  `billing_details` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_payment_method_id` (`payment_method_id`),
  KEY `idx_user_uid` (`user_uid`),
  KEY `idx_is_default` (`is_default`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: webhook_events
-- Purpose: Log all webhook events from Stripe/Pagar.me
-- ===================================================
CREATE TABLE IF NOT EXISTS `webhook_events` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` VARCHAR(100) NOT NULL UNIQUE,
  `provider` ENUM('stripe', 'pagarme') NOT NULL,
  `event_type` VARCHAR(255) NOT NULL,
  `event_data` LONGTEXT NOT NULL,
  `processed` TINYINT(1) DEFAULT 0,
  `processed_at` DATETIME,
  `error` TEXT,
  `retry_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event_id` (`event_id`),
  KEY `idx_provider` (`provider`),
  KEY `idx_processed` (`processed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- INSERT DEFAULT PLANS
-- ===================================================
INSERT INTO `plans` (`plan_id`, `name`, `description`, `price`, `currency`, `interval`, `features`, `limits`, `is_active`, `display_order`, `is_popular`, `trial_days`) VALUES
('free', 'Free', 'Perfect for getting started', 0.00, 'BRL', 'monthly',
 '["1 WhatsApp Instance", "100 contacts", "500 messages/month", "Basic chatbots", "Email support"]',
 '{"contacts": 100, "messages": 500, "instances": 1, "chatbots": 3, "flows": 5, "agents": 0, "broadcasts": 10}',
 1, 1, 0, 0),

('starter', 'Starter', 'For small businesses', 49.90, 'BRL', 'monthly',
 '["2 WhatsApp Instances", "1,000 contacts", "5,000 messages/month", "Advanced chatbots", "5 custom flows", "Priority support"]',
 '{"contacts": 1000, "messages": 5000, "instances": 2, "chatbots": 10, "flows": 5, "agents": 1, "broadcasts": 50}',
 1, 2, 0, 7),

('professional', 'Professional', 'For growing businesses', 149.90, 'BRL', 'monthly',
 '["5 WhatsApp Instances", "10,000 contacts", "25,000 messages/month", "Unlimited chatbots", "Unlimited flows", "3 agents", "Priority support", "API access"]',
 '{"contacts": 10000, "messages": 25000, "instances": 5, "chatbots": -1, "flows": -1, "agents": 3, "broadcasts": 200}',
 1, 3, 1, 14),

('business', 'Business', 'For large teams', 399.90, 'BRL', 'monthly',
 '["15 WhatsApp Instances", "50,000 contacts", "100,000 messages/month", "Unlimited chatbots", "Unlimited flows", "10 agents", "Dedicated support", "API access", "White label"]',
 '{"contacts": 50000, "messages": 100000, "instances": 15, "chatbots": -1, "flows": -1, "agents": 10, "broadcasts": 500}',
 1, 4, 0, 14),

('enterprise', 'Enterprise', 'Custom solution for enterprises', 0.00, 'BRL', 'monthly',
 '["Unlimited Instances", "Unlimited contacts", "Unlimited messages", "Unlimited everything", "Dedicated account manager", "24/7 support", "Custom integrations", "SLA guarantee"]',
 '{"contacts": -1, "messages": -1, "instances": -1, "chatbots": -1, "flows": -1, "agents": -1, "broadcasts": -1}',
 1, 5, 0, 30);

-- ===================================================
-- ALTER users table to add subscription fields
-- Note: Using procedural approach to avoid errors if columns exist
-- ===================================================

-- Add current_plan_id if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'current_plan_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `current_plan_id` VARCHAR(100) DEFAULT \'free\'',
  'SELECT "Column current_plan_id already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add subscription_status if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'subscription_status');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `subscription_status` ENUM(\'active\', \'canceled\', \'past_due\', \'trialing\', \'none\') DEFAULT \'none\'',
  'SELECT "Column subscription_status already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add subscription_id if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'subscription_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `subscription_id` VARCHAR(100)',
  'SELECT "Column subscription_id already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add stripe_customer_id if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'stripe_customer_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `stripe_customer_id` VARCHAR(255)',
  'SELECT "Column stripe_customer_id already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add pagarme_customer_id if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'pagarme_customer_id');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `pagarme_customer_id` VARCHAR(255)',
  'SELECT "Column pagarme_customer_id already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add indexes if they don't exist
SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND INDEX_NAME = 'idx_current_plan');
SET @sql = IF(@index_exists = 0,
  'ALTER TABLE `user` ADD KEY `idx_current_plan` (`current_plan_id`)',
  'SELECT "Index idx_current_plan already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @index_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND INDEX_NAME = 'idx_subscription_status');
SET @sql = IF(@index_exists = 0,
  'ALTER TABLE `user` ADD KEY `idx_subscription_status` (`subscription_status`)',
  'SELECT "Index idx_subscription_status already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

COMMIT;
