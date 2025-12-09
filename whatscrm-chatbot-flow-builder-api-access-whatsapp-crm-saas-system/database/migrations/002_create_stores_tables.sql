-- Migration: Stores & Automations System
-- Created: 2025-12-07
-- Description: Creates tables for e-commerce integrations and automated workflows

-- ===================================================
-- TABLE: stores
-- Purpose: Store connected e-commerce platforms
-- ===================================================
CREATE TABLE IF NOT EXISTS `stores` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `store_id` VARCHAR(100) NOT NULL UNIQUE,
  `user_id` INT(11) NOT NULL,
  `user_uid` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `platform` ENUM('shopify', 'vtex', 'woocommerce', 'custom') NOT NULL,
  `url` VARCHAR(500) NOT NULL,
  `api_key` TEXT,
  `api_secret` TEXT,
  `access_token` TEXT,
  `shop_domain` VARCHAR(255),
  `status` ENUM('pending', 'connected', 'error', 'disconnected') NOT NULL DEFAULT 'pending',
  `last_sync_at` DATETIME,
  `sync_errors` LONGTEXT,
  `settings` LONGTEXT,
  `metadata` LONGTEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_user_uid` (`user_uid`),
  KEY `idx_platform` (`platform`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: store_products
-- Purpose: Cache synced products from stores
-- ===================================================
CREATE TABLE IF NOT EXISTS `store_products` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `product_id` VARCHAR(100) NOT NULL UNIQUE,
  `store_id` VARCHAR(100) NOT NULL,
  `external_id` VARCHAR(255) NOT NULL,
  `title` VARCHAR(500),
  `description` TEXT,
  `price` DECIMAL(10, 2),
  `currency` VARCHAR(3) DEFAULT 'BRL',
  `image_url` TEXT,
  `sku` VARCHAR(255),
  `stock_quantity` INT(11),
  `is_active` TINYINT(1) DEFAULT 1,
  `metadata` LONGTEXT,
  `synced_at` DATETIME,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_product_id` (`product_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_external_id` (`external_id`),
  KEY `idx_sku` (`sku`),
  FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: automation_templates
-- Purpose: Predefined automation templates
-- ===================================================
CREATE TABLE IF NOT EXISTS `automation_templates` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `template_id` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `type` ENUM('abandoned_cart', 'checkout_recovery', 'product_view', 'order_confirmation', 'shipping_update', 'review_request', 'custom') NOT NULL,
  `platform` VARCHAR(50),
  `flow_template` LONGTEXT NOT NULL,
  `default_config` LONGTEXT,
  `is_active` TINYINT(1) DEFAULT 1,
  `icon` VARCHAR(100),
  `category` VARCHAR(100),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_template_id` (`template_id`),
  KEY `idx_type` (`type`),
  KEY `idx_platform` (`platform`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: store_automations
-- Purpose: Active automations for each store
-- ===================================================
CREATE TABLE IF NOT EXISTS `store_automations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `automation_id` VARCHAR(100) NOT NULL UNIQUE,
  `store_id` VARCHAR(100) NOT NULL,
  `user_uid` VARCHAR(255) NOT NULL,
  `template_id` VARCHAR(100),
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('abandoned_cart', 'checkout_recovery', 'product_view', 'order_confirmation', 'shipping_update', 'review_request', 'custom') NOT NULL,
  `flow_id` VARCHAR(255),
  `is_active` TINYINT(1) DEFAULT 1,
  `config` LONGTEXT,
  `stats` LONGTEXT,
  `last_triggered_at` DATETIME,
  `total_triggers` INT(11) DEFAULT 0,
  `total_conversions` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_automation_id` (`automation_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_user_uid` (`user_uid`),
  KEY `idx_type` (`type`),
  KEY `idx_is_active` (`is_active`),
  FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: automation_executions
-- Purpose: Log of automation executions
-- ===================================================
CREATE TABLE IF NOT EXISTS `automation_executions` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `execution_id` VARCHAR(100) NOT NULL UNIQUE,
  `automation_id` VARCHAR(100) NOT NULL,
  `store_id` VARCHAR(100) NOT NULL,
  `trigger_type` VARCHAR(100),
  `trigger_data` LONGTEXT,
  `contact_number` VARCHAR(50),
  `contact_name` VARCHAR(255),
  `status` ENUM('pending', 'running', 'completed', 'failed') DEFAULT 'pending',
  `result` LONGTEXT,
  `error_message` TEXT,
  `converted` TINYINT(1) DEFAULT 0,
  `conversion_value` DECIMAL(10, 2),
  `started_at` DATETIME,
  `completed_at` DATETIME,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_execution_id` (`execution_id`),
  KEY `idx_automation_id` (`automation_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_status` (`status`),
  KEY `idx_converted` (`converted`),
  KEY `idx_created_at` (`created_at`),
  FOREIGN KEY (`automation_id`) REFERENCES `store_automations` (`automation_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: store_webhooks
-- Purpose: Webhook configurations for stores
-- ===================================================
CREATE TABLE IF NOT EXISTS `store_webhooks` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `webhook_id` VARCHAR(100) NOT NULL UNIQUE,
  `store_id` VARCHAR(100) NOT NULL,
  `platform_webhook_id` VARCHAR(255),
  `event_type` VARCHAR(100) NOT NULL,
  `endpoint_url` VARCHAR(500),
  `is_active` TINYINT(1) DEFAULT 1,
  `last_received_at` DATETIME,
  `total_received` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_webhook_id` (`webhook_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_event_type` (`event_type`),
  FOREIGN KEY (`store_id`) REFERENCES `stores` (`store_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- TABLE: store_webhook_logs
-- Purpose: Log all webhook events received
-- ===================================================
CREATE TABLE IF NOT EXISTS `store_webhook_logs` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `log_id` VARCHAR(100) NOT NULL UNIQUE,
  `store_id` VARCHAR(100) NOT NULL,
  `webhook_id` VARCHAR(100),
  `event_type` VARCHAR(100) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `processed` TINYINT(1) DEFAULT 0,
  `processed_at` DATETIME,
  `error` TEXT,
  `retry_count` INT(11) DEFAULT 0,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_log_id` (`log_id`),
  KEY `idx_store_id` (`store_id`),
  KEY `idx_event_type` (`event_type`),
  KEY `idx_processed` (`processed`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ===================================================
-- INSERT DEFAULT AUTOMATION TEMPLATES
-- ===================================================
INSERT INTO `automation_templates`
  (`template_id`, `name`, `description`, `type`, `platform`, `flow_template`, `default_config`, `icon`, `category`)
VALUES
-- Abandoned Cart Template
('tpl_abandoned_cart', 'Recuperação de Carrinho Abandonado',
 'Envie mensagens automáticas para clientes que abandonaram carrinhos de compras',
 'abandoned_cart', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "cart_abandoned"}}, {"id": "2", "type": "delay", "data": {"minutes": 30}}, {"id": "3", "type": "send_message", "data": {"template": "Olá {{name}}, notamos que você deixou itens no carrinho. Complete sua compra agora! {{cart_url}}"}}]}',
 '{"delay_minutes": 30, "max_reminders": 2, "discount_code": null}',
 'shopping-cart', 'recovery'),

-- Checkout Recovery Template
('tpl_checkout_recovery', 'Recuperação de Checkout',
 'Recupere vendas de checkouts iniciados mas não finalizados',
 'checkout_recovery', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "checkout_started"}}, {"id": "2", "type": "delay", "data": {"minutes": 60}}, {"id": "3", "type": "send_message", "data": {"template": "Oi {{name}}! Vimos que você estava quase finalizando sua compra. Podemos ajudar? {{checkout_url}}"}}]}',
 '{"delay_minutes": 60, "offer_discount": false, "discount_percentage": 10}',
 'credit-card', 'recovery'),

-- Product View Template
('tpl_product_view', 'Acompanhamento de Produto Visualizado',
 'Envie lembretes sobre produtos visualizados mas não comprados',
 'product_view', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "product_viewed"}}, {"id": "2", "type": "delay", "data": {"hours": 24}}, {"id": "3", "type": "send_message", "data": {"template": "Ainda interessado em {{product_name}}? Temos estoque limitado! {{product_url}}"}}]}',
 '{"delay_hours": 24, "min_price": 0, "send_if_purchased": false}',
 'eye', 'engagement'),

-- Order Confirmation Template
('tpl_order_confirmation', 'Confirmação de Pedido',
 'Confirme automaticamente pedidos realizados',
 'order_confirmation', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "order_created"}}, {"id": "2", "type": "send_message", "data": {"template": "Pedido #{{order_number}} confirmado! Obrigado pela compra, {{name}}. Total: {{order_total}}. Acompanhe em: {{tracking_url}}"}}]}',
 '{"include_items": true, "send_tracking": true}',
 'check-circle', 'transactional'),

-- Shipping Update Template
('tpl_shipping_update', 'Atualização de Envio',
 'Notifique clientes sobre atualizações de envio',
 'shipping_update', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "order_shipped"}}, {"id": "2", "type": "send_message", "data": {"template": "Seu pedido #{{order_number}} foi enviado! Código de rastreio: {{tracking_code}}. Previsão de entrega: {{delivery_date}}"}}]}',
 '{"send_tracking_updates": true, "notify_on_delivery": true}',
 'truck', 'transactional'),

-- Review Request Template
('tpl_review_request', 'Solicitação de Avaliação',
 'Peça avaliações após a entrega do produto',
 'review_request', NULL,
 '{"nodes": [{"id": "1", "type": "trigger", "data": {"event": "order_delivered"}}, {"id": "2", "type": "delay", "data": {"days": 3}}, {"id": "3", "type": "send_message", "data": {"template": "Olá {{name}}! Recebeu seu pedido? Adoraríamos saber sua opinião! Avalie em: {{review_url}}"}}]}',
 '{"delay_days": 3, "offer_incentive": false, "incentive_type": "discount"}',
 'star', 'engagement');

-- ===================================================
-- ALTER users table to add store limits
-- ===================================================

-- Add stores_count if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'stores_count');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `stores_count` INT(11) DEFAULT 0',
  'SELECT "Column stores_count already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add max_stores if it doesn't exist
SET @col_exists = (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'user' AND COLUMN_NAME = 'max_stores');
SET @sql = IF(@col_exists = 0,
  'ALTER TABLE `user` ADD COLUMN `max_stores` INT(11) DEFAULT 1',
  'SELECT "Column max_stores already exists" AS info');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

COMMIT;
