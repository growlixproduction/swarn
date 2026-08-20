-- ================================================================
-- 👑 SWARN MAHAL - SEED DATA SCRIPT FOR MYSQL / PHPMYADMIN
-- Run this AFTER importing schema.sql
-- ================================================================

USE `u239297722_sawarn_db`;

-- 1. SEED LIVE BULLION RATES (2026 Benchmark)
INSERT INTO `bullion_rates` (`gold_24k_per_gram`, `gold_22k_per_gram`, `gold_18k_per_gram`, `gold_14k_per_gram`, `silver_925_per_gram`, `trend_24h`, `updated_by`) 
VALUES (15920.00, 14600.00, 11940.00, 9285.00, 180.00, '+0.45%', 'Master Admin Live 2026');


-- 2. SEED CATEGORIES
INSERT INTO `categories` (`slug`, `name`, `parent_slug`, `description`, `display_order`, `is_active`) VALUES
('all', 'All Master Catalogue', NULL, 'Complete curation of Swarn Mahal jewellery', 1, 1),
('gold', '22K Pure Gold Jewellery', NULL, 'BIS 916 hallmarked 22K gold heirlooms', 2, 1),
('diamond', 'Certified Diamond & Solitaires', NULL, 'IGI & GIA certified optical diamond solitaire rings & bands', 3, 1),
('earrings', 'Earrings, Jhumkas & Drops', NULL, 'Traditional 22K jhumkas, diamond tops & sui-dhagas', 4, 1),
('daily-wear', 'Lightweight Daily Wear', NULL, 'Under 10 grams minimalist jewellery for modern lifestyles', 5, 1),
('wedding', 'Bridal & Wedding Couture', NULL, 'Royal Rani Haars, Kundan Chokers & Trousseau Sets', 6, 1),
('gifting', 'Luxury Gifting & Occasions', NULL, 'Solitaires, Gold Coins & Milestone Gifting', 7, 1),
('bullion', '24K Gold Coins & Investment', NULL, '99.9% pure 24K assayed blister coins & fine silver bars', 8, 1),
('silver', '925 Sterling Silverware', NULL, 'Puja thalis, diyas, payals & silverware', 9, 1),
('mens', 'Men\'s Luxury Collection', NULL, 'Solid 22K gold chains, kadas & signet rings', 10, 1),
('kids', 'Kids & Nazariya Blessings', NULL, 'Gold nazariya bracelets, baby kadas & stud earrings', 11, 1),
('under-50k', 'Budget Tier Under ₹50K', NULL, 'Handpicked premium items under ₹50,000', 12, 1);

-- 3. SEED HERO BANNER SLIDES
INSERT INTO `hero_banners` (`slide_code`, `display_order`, `tag_badge`, `title_main`, `title_italic`, `description`, `button_text`, `button_link`, `background_image`, `is_active`) VALUES
('hero-slide-1', 1, 'BRIDAL COUTURE 2026', 'ROYAL HEIRLOOMS &', 'BRIDAL KUNDAN', 'Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.', 'EXPLORE HERITAGE', '/wedding.html', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85', 1),
('hero-slide-2', 2, 'CERTIFIED SOLITAIRES', 'FOREVER BRILLIANCE', 'IGI DIAMONDS', 'Hand-selected VVS-EF clarity natural diamonds set in 18K white and rose gold bands.', 'SHOP SOLITAIRES', '/diamond.html', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85', 1),
('hero-slide-3', 3, '24K PURE BULLION', '99.9% ASSAYED', 'GOLD COINS', 'Tamper-proof blister packaged Laxmi Ganesh 24K coins with 100% buyback guarantee.', 'BUY GOLD COINS', '/gifting.html', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85', 1);

-- 4. SEED SAMPLE PRODUCTS
INSERT INTO `products` (
  `id`, `title`, `slug`, `category`, `sub_category`, `collection_name`, `description`, `dimensions`,
  `net_gold_weight_grams`, `gross_weight_grams`, `default_karat`, `supported_karats`, `default_color`, `supported_colors`,
  `making_charge_type`, `making_charge_percent`, `making_charge_per_gram`, `discount_percent`,
  `huid`, `certificate`, `rating`, `reviews_count`, `is_featured`, `is_new`, `gender`, `style_theme`
) VALUES (
  'SM-101', 'Rubans Modern Solitaire Ring', 'rubans-modern-solitaire-ring', 'rings', 'Solitaire Rings', 'Solitaire Collection',
  'A classic 4-prong setting cradles a brilliant round solitaire diamond atop a refined, tapered 18K solid gold band.',
  'Band Width: 2.2mm | Crown Height: 5.5mm',
  3.200, 3.270, '18K', '["14K", "18K", "22K"]', 'yellow', '["yellow", "rose", "white"]',
  'percent', 14.00, 0.00, 15.00,
  'SM916A8201', 'IGI-LG5829104', 4.90, 24, 1, 1, 'Women', 'Modern Solitaire'
),
(
  'SM-102', 'Royal Jaipur Meenakari Jhumkas', 'royal-jaipur-meenakari-jhumkas', 'earrings', 'Jhumkas', 'Royal Heirloom Collection',
  'Handcrafted 22K yellow gold jhumkas adorned with traditional Jaipur enamel (Meenakari), pearl drops, and floral filigree.',
  'Length: 48mm | Width: 22mm',
  14.500, 15.200, '22K', '["22K"]', 'yellow', '["yellow"]',
  'percent', 16.00, 0.00, 10.00,
  'SM916J9022', 'BIS 916 HALLMARK', 5.00, 18, 1, 0, 'Women', 'Heritage Traditional'
),
(
  'SM-103', '24K Laxmi Ganesh 10g Gold Coin', '24k-laxmi-ganesh-10g-gold-coin', 'bullion', 'Gold Coins', '24K Assayed Coins',
  '99.9% 24K Pure Gold coin embossed with Lord Ganesha and Goddess Lakshmi motifs. Sealed in NABL assayed tamper-evident card.',
  'Diameter: 22mm | Thickness: 1.8mm',
  10.000, 10.000, '24K', '["24K"]', 'yellow', '["yellow"]',
  'percent', 4.00, 0.00, 0.00,
  'SM999C1001', 'NABL / BIS 24K ASSAY', 5.00, 42, 1, 1, 'Unisex', 'Bullion Asset'
);

-- 5. SEED PRODUCT IMAGES
INSERT INTO `product_images` (`product_id`, `yellow_gold_image`, `rose_gold_image`, `white_gold_image`, `hover_image`, `gallery_images`) VALUES
('SM-101', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"]'),
('SM-102', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"]'),
('SM-103', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85"]');

-- 6. SEED DIAMOND SPECS
INSERT INTO `diamond_specs` (`product_id`, `stone_count`, `total_carat_weight`, `clarity`, `cut`, `price_per_carat`) VALUES
('SM-101', 1, 0.350, 'VVS-EF', 'Round Brilliant', 68000.00);

-- 7. SEED PRODUCT NAV MAPPING
INSERT INTO `product_nav_categories` (`product_id`, `nav_category_slug`) VALUES
('SM-101', 'all'), ('SM-101', 'diamond'), ('SM-101', 'gifting'), ('SM-101', 'under-50k'),
('SM-102', 'all'), ('SM-102', 'gold'), ('SM-102', 'earrings'), ('SM-102', 'wedding'),
('SM-103', 'all'), ('SM-103', 'gold'), ('SM-103', 'bullion'), ('SM-103', 'gifting'), ('SM-103', 'under-50k');

-- 8. SEED SEARCH TAGS
INSERT INTO `product_search_tags` (`product_id`, `keyword`, `tag_type`) VALUES
('SM-101', 'solitaire ring', 'search_keyword'),
('SM-101', 'diamond ring', 'search_keyword'),
('SM-101', '#SolitaireRing', 'hashtag'),
('SM-102', 'jhumka', 'search_keyword'),
('SM-102', '22k earrings', 'search_keyword'),
('SM-102', '#BridalJewellery', 'hashtag'),
('SM-103', '24k gold coin', 'search_keyword'),
('SM-103', 'laxmi ganesh coin', 'search_keyword');

-- 9. SEED SITE BRANDING & STORE CONFIG SETTINGS
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `description`) VALUES
('site_logo_text', 'SWARN MAHAL', 'Main logo brand title'),
('site_logo_subtext', 'SAWARN LUXURY JEWELS • AMBIKAPUR', 'Subtitle under logo'),
('site_logo_symbol', 'SM', 'Logo badge monogram initials'),
('site_logo_image', '/asset/logo.jpg', 'Custom logo image URL (if used)'),
('store_name', 'Swarn Mahal Jewellers', 'Legal store name'),
('store_tagline', 'Sawarn Luxury Jewels & Heritage Bullion', 'Brand slogan/tagline'),
('store_city', 'Ambikapur', 'Store city'),
('store_address', 'Church Road, Joda Pipal, Maharaja Gali, Ambikapur, Chhattisgarh - 497001', 'Full showroom address'),
('store_phone', '+91 99997 77740 / +91 7774-241216', 'Contact numbers'),
('store_whatsapp', '+91 99997 77740', 'WhatsApp business number'),
('store_email', 'contact@swarnmahalambikapur.com', 'Official email'),
('store_timing', 'Mon - Sun: 09:00 AM - 09:00 PM (Open All 7 Days)', 'Showroom timings'),
('store_gstin', '22AABCJ9823Q1Z4', 'GSTIN number'),
('footer_about', 'Ambikapur\'s premier destination for 22K BIS 916 hallmarked luxury gold heirlooms, certified IGI diamond solitaires, and 24K pure bullion investment coins.', 'Footer bio description'),
('footer_copyright', '© 2026 Swarn Mahal Jewellers. All Rights Reserved.', 'Copyright notice');

