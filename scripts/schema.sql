-- ================================================================
-- 👑 SWARN MAHAL LUXURY JEWELLERY - COMPLETE MYSQL DATABASE SCHEMA
-- Compatible with Hostinger MySQL & MariaDB
-- ================================================================

CREATE DATABASE IF NOT EXISTS `u239297722_sawarn_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `u239297722_sawarn_db`;

-- ----------------------------------------------------------------
-- 1. ADMIN USERS & ROLES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('master_admin', 'showroom_manager', 'inventory_operator', 'karigar') DEFAULT 'inventory_operator',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 2. MASTER COLLECTIONS & CATEGORIES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `name` VARCHAR(150) NOT NULL,
  `parent_slug` VARCHAR(100) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `thumbnail_image` VARCHAR(500) DEFAULT NULL,
  `banner_image` VARCHAR(500) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 3. PRODUCTS CORE TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `products` (
  `id` VARCHAR(50) PRIMARY KEY, -- SKU (e.g. SM-101)
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(100) NOT NULL, -- Core category (rings, necklaces, bullion, etc.)
  `sub_category` VARCHAR(100) DEFAULT NULL,
  `collection_name` VARCHAR(150) DEFAULT NULL,
  `description` TEXT NOT NULL,
  `dimensions` VARCHAR(255) DEFAULT NULL,
  
  -- Precious Metal & Weights
  `net_gold_weight_grams` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `gross_weight_grams` DECIMAL(8,3) NOT NULL DEFAULT 0.000,
  `default_karat` ENUM('24K', '22K', '18K', '14K', '9K') NOT NULL DEFAULT '22K',
  `supported_karats` JSON NOT NULL, -- e.g. ["14K", "18K", "22K"]
  `default_color` ENUM('yellow', 'rose', 'white') NOT NULL DEFAULT 'yellow',
  `supported_colors` JSON NOT NULL, -- e.g. ["yellow", "rose", "white"]

  -- Making Charges & Discounts
  `making_charge_type` ENUM('percent', 'per_gram') NOT NULL DEFAULT 'percent',
  `making_charge_percent` DECIMAL(5,2) DEFAULT 0.00,
  `making_charge_per_gram` DECIMAL(8,2) DEFAULT 0.00,
  `discount_percent` DECIMAL(5,2) DEFAULT 0.00,

  -- Compliance & Hallmarking
  `huid` VARCHAR(50) NOT NULL, -- BIS 6-digit laser alphanumeric HUID
  `certificate` VARCHAR(100) NOT NULL, -- e.g. IGI-LG5829104 / BIS 916

  -- Status, Badges & Ratings
  `rating` DECIMAL(3,2) DEFAULT 4.90,
  `reviews_count` INT DEFAULT 0,
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_new` TINYINT(1) DEFAULT 0,
  `stock_quantity` INT DEFAULT 1,
  `is_in_stock` TINYINT(1) DEFAULT 1,
  
  -- Target Attributes
  `gender` ENUM('Women', 'Men', 'Unisex', 'Kids') DEFAULT 'Women',
  `style_theme` VARCHAR(100) DEFAULT NULL,

  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 4. PRODUCT NAV CATEGORIES MAPPING (Many-to-Many taxonomy)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_nav_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `nav_category_slug` VARCHAR(100) NOT NULL,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  UNIQUE KEY `product_category_unique` (`product_id`, `nav_category_slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 5. DIAMOND & SOLITAIRE SPECIFICATIONS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `diamond_specs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL UNIQUE,
  `stone_count` INT DEFAULT 1,
  `total_carat_weight` DECIMAL(6,3) NOT NULL DEFAULT 0.000,
  `clarity` VARCHAR(50) NOT NULL DEFAULT 'VVS-EF',
  `cut` VARCHAR(50) NOT NULL DEFAULT 'Round Brilliant',
  `price_per_carat` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 6. GEMSTONE SPECIFICATIONS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gemstone_specs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL UNIQUE,
  `stone_type` VARCHAR(100) NOT NULL, -- e.g. Natural Zambian Emerald
  `weight_carat` DECIMAL(6,3) NOT NULL DEFAULT 0.000,
  `price_per_carat` DECIMAL(10,2) DEFAULT 0.00,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 7. PRODUCT IMAGES & THUMBNAILS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_images` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL UNIQUE,
  `yellow_gold_image` VARCHAR(500) NOT NULL,
  `rose_gold_image` VARCHAR(500) DEFAULT NULL,
  `white_gold_image` VARCHAR(500) DEFAULT NULL,
  `hover_image` VARCHAR(500) NOT NULL,
  `gallery_images` JSON DEFAULT NULL, -- Array of additional high-res zoom image URLs
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 8. SEARCH TAGS & HASHTAGS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `product_search_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `product_id` VARCHAR(50) NOT NULL,
  `keyword` VARCHAR(100) NOT NULL,
  `tag_type` ENUM('search_keyword', 'hashtag', 'occasion') DEFAULT 'search_keyword',
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  INDEX `idx_keyword` (`keyword`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 9. HERO BANNER SLIDER & SPOTLIGHT CARDS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `hero_banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `slide_code` VARCHAR(50) UNIQUE,
  `display_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  `tag_badge` VARCHAR(100) DEFAULT 'BRIDAL COUTURE 2026',
  `title_main` VARCHAR(255) NOT NULL,
  `title_italic` VARCHAR(255) DEFAULT NULL,
  `description` TEXT DEFAULT NULL,
  `button_text` VARCHAR(100) DEFAULT 'EXPLORE COLLECTION',
  `button_link` VARCHAR(255) DEFAULT '/gold.html',
  `background_image` VARCHAR(500) NOT NULL,
  `overlay_gradient` VARCHAR(500) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 10. LIVE BULLION RATES & HISTORY TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `bullion_rates` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `gold_24k_per_gram` DECIMAL(10,2) NOT NULL,
  `gold_22k_per_gram` DECIMAL(10,2) NOT NULL,
  `gold_18k_per_gram` DECIMAL(10,2) NOT NULL,
  `gold_14k_per_gram` DECIMAL(10,2) NOT NULL,
  `silver_925_per_gram` DECIMAL(10,2) NOT NULL,
  `trend_24h` VARCHAR(50) DEFAULT '+0.45%',
  `updated_by` VARCHAR(100) DEFAULT 'System API',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 11. SHOWROOM VAULT & BENTO COLLAGE GALLERY TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `showroom_gallery` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `gallery_code` VARCHAR(50) UNIQUE,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) DEFAULT 'bridal',
  `badge` VARCHAR(100) DEFAULT '22K BIS 916',
  `span_class` VARCHAR(50) DEFAULT 'span-tall', -- span-tall, span-wide, etc.
  `image_url` VARCHAR(500) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `specs_text` VARCHAR(255) DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 12. GIFTING & OCCASION PACKAGING CONFIG TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `gifting_options` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `option_type` VARCHAR(100) NOT NULL, -- e.g. signature_velvet_box, rosewood_chest
  `title` VARCHAR(200) NOT NULL,
  `price` DECIMAL(8,2) DEFAULT 0.00,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `is_active` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 13. CUSTOMER ORDERS & INVOICES TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_number` VARCHAR(50) NOT NULL UNIQUE, -- e.g. SM-ORD-2026-901
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `customer_email` VARCHAR(150) DEFAULT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) DEFAULT 'Ambikapur',
  `pincode` VARCHAR(10) NOT NULL,

  `total_metal_cost` DECIMAL(12,2) NOT NULL,
  `total_making_charges` DECIMAL(12,2) NOT NULL,
  `total_diamond_cost` DECIMAL(12,2) DEFAULT 0.00,
  `gst_amount` DECIMAL(12,2) NOT NULL,
  `grand_total` DECIMAL(12,2) NOT NULL,

  `payment_method` ENUM('UPI', 'Razorpay', 'Card', 'NetBanking', 'COD') DEFAULT 'Razorpay',
  `payment_status` ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
  `order_status` ENUM('Received', 'Processing', 'Karigar_Assigned', 'Dispatched', 'Delivered', 'Cancelled') DEFAULT 'Received',
  
  `razorpay_payment_id` VARCHAR(100) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 14. ORDER ITEMS BREAKDOWN TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `product_id` VARCHAR(50) NOT NULL,
  `product_title` VARCHAR(255) NOT NULL,
  `karat` VARCHAR(10) NOT NULL,
  `metal_tone` VARCHAR(20) NOT NULL,
  `size` VARCHAR(50) DEFAULT NULL,
  `engraving_text` VARCHAR(100) DEFAULT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `unit_price` DECIMAL(12,2) NOT NULL,
  `net_weight` DECIMAL(8,3) NOT NULL,
  `huid` VARCHAR(50) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- 15. SITE BRANDING, LOGO, FOOTER & STORE CONFIG SETTINGS TABLE
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `setting_key` VARCHAR(100) NOT NULL UNIQUE,
  `setting_value` TEXT DEFAULT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

