-- ============================================================================
-- 👑 SWARN MAHAL LUXURY JEWELLERY - COMPLETE FULL DATABASE SEED & SYNC SCRIPT
-- Paste and Run this in Hostinger phpMyAdmin (SQL Tab) to push ALL data into MySQL!
-- ============================================================================

USE `u239297722_sawarn_db`;

-- DISABLE FOREIGN KEY CHECKS FOR CLEAN TRUNCATE & PUSH
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `product_search_tags`;
TRUNCATE TABLE `product_nav_categories`;
TRUNCATE TABLE `product_images`;
TRUNCATE TABLE `diamond_specs`;
TRUNCATE TABLE `gemstone_specs`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
TRUNCATE TABLE `hero_banners`;
TRUNCATE TABLE `bullion_rates`;
TRUNCATE TABLE `showroom_gallery`;
TRUNCATE TABLE `site_settings`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. PUSH LIVE BULLION RATES (2026 Benchmark)
INSERT INTO `bullion_rates` (`gold_24k_per_gram`, `gold_22k_per_gram`, `gold_18k_per_gram`, `gold_14k_per_gram`, `silver_925_per_gram`, `trend_24h`, `updated_by`) 
VALUES (15920.00, 14600.00, 11940.00, 9285.00, 180.00, '+0.45%', 'Master Admin Live 2026');


-- 2. PUSH CATEGORIES & COLLECTION METADATA
INSERT INTO `categories` (`slug`, `name`, `parent_slug`, `description`, `thumbnail_image`, `banner_image`, `display_order`, `is_active`) VALUES
('all', 'All Master Catalogue', NULL, 'Complete curation of Swarn Mahal jewellery', NULL, 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1600&q=85', 1, 1),
('gold', '22K Pure Gold Jewellery', NULL, 'BIS 916 hallmarked 22K gold heirlooms', NULL, 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85', 2, 1),
('diamond', 'Certified Diamond & Solitaires', NULL, 'IGI & GIA certified optical diamond solitaire rings & bands', NULL, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85', 3, 1),
('earrings', 'Earrings, Jhumkas & Drops', NULL, 'Traditional 22K jhumkas, diamond tops & sui-dhagas', NULL, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1600&q=85', 4, 1),
('daily-wear', 'Lightweight Daily Wear', NULL, 'Under 10 grams minimalist jewellery for modern lifestyles', NULL, 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=1600&q=85', 5, 1),
('gemstone', 'Royal Gemstones & Pearls', NULL, 'Natural Zambian emeralds, Ceylon sapphires & pearls', NULL, 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1600&q=85', 6, 1),
('wedding', 'Bridal Couture & Royal Heirlooms', NULL, 'Royal Rani Haars, Kundan Chokers & Trousseau Sets', NULL, '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg', 7, 1),
('gifting', 'Luxury Gifting & 24K Gold Coins', NULL, 'Solitaires, Gold Coins & Milestone Gifting', NULL, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85', 8, 1),
('under-50k', 'Affordable Fine Jewellery Under ₹50K', NULL, 'Handpicked premium items under ₹50,000', NULL, 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1600&q=85', 9, 1);

-- 3. PUSH HERO BANNER SLIDES
INSERT INTO `hero_banners` (`slide_code`, `display_order`, `tag_badge`, `title_main`, `title_italic`, `description`, `button_text`, `button_link`, `background_image`, `is_active`) VALUES
('hero-slide-1', 1, 'BRIDAL COUTURE 2026', 'ROYAL HEIRLOOMS &', 'BRIDAL KUNDAN', 'Intricately woven 22K gold with uncut diamonds, emeralds & pearls crafted for brides.', 'EXPLORE HERITAGE', '/collections/wedding', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=85', 1),
('hero-slide-2', 2, 'CERTIFIED SOLITAIRES', 'FOREVER BRILLIANCE', 'IGI DIAMONDS', 'Hand-selected VVS-EF clarity natural diamonds set in 18K white and rose gold bands.', 'SHOP SOLITAIRES', '/collections/diamond', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1600&q=85', 1),
('hero-slide-3', 3, '24K PURE BULLION', '99.9% ASSAYED', 'GOLD COINS', 'Tamper-proof blister packaged Laxmi Ganesh 24K coins with 100% buyback guarantee.', 'BUY GOLD COINS', '/collections/gifting', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1600&q=85', 1);

-- 4. PUSH ALL PRODUCTS INTO MYSQL
INSERT INTO `products` (
  `id`, `title`, `slug`, `category`, `sub_category`, `collection_name`, `description`, `dimensions`,
  `net_gold_weight_grams`, `gross_weight_grams`, `default_karat`, `supported_karats`, `default_color`, `supported_colors`,
  `making_charge_type`, `making_charge_percent`, `making_charge_per_gram`, `discount_percent`,
  `huid`, `certificate`, `rating`, `reviews_count`, `is_featured`, `is_new`, `gender`, `style_theme`
) VALUES 
('SM-101', 'Rubans Modern Solitaire Ring', 'rubans-modern-solitaire-ring', 'rings', 'Solitaire Rings', 'Solitaire Collection', 'Handcrafted 18K gold band crowned with a certified round brilliant solitaire diamond. Designed with tapered knife-edge shoulders for maximum light return.', 'Band Width: 2.2mm | Crown Height: 5.5mm', 4.850, 5.100, '18K', '["14K", "18K", "22K"]', 'yellow', '["yellow", "rose", "white"]', 'percent', 14.00, 0.00, 15.00, 'SM916A8201', 'IGI-LG5829104', 4.90, 24, 1, 1, 'Women', 'Modern Solitaire'),
('SM-102', 'Swarn Mahal 22K Royal Rani Haar', 'swarn-mahal-22k-royal-rani-haar', 'necklaces', 'Rani Haar', 'Heritage Ambikapur', 'Traditional North Chhattisgarh bridal Rani Haar with grand meenakari peacock pendant and multi-strand gold bead chains.', 'Length: 24 Inches | Width: 45mm', 28.500, 29.200, '22K', '["22K"]', 'yellow', '["yellow"]', 'percent', 16.00, 0.00, 12.00, 'SM916RH1285', 'BIS 916 HALLMARK', 5.00, 48, 1, 1, 'Women', 'Bridal Heritage'),
('SM-103', 'Heritage 22K Royal Peacock Jhumkas', 'heritage-22k-royal-peacock-jhumkas', 'earrings', 'Jhumkas', 'Royal Heirloom', 'Handcrafted 22K gold jhumkas adorned with intricate filigree peacock motifs and hanging gold bead drops.', 'Length: 48mm | Dome Width: 22mm', 10.500, 11.000, '22K', '["22K"]', 'yellow', '["yellow"]', 'percent', 15.00, 0.00, 10.00, 'SM916JK105', 'BIS 916 HALLMARK', 4.95, 36, 1, 0, 'Women', 'Temple Jhumkas'),
('SM-104', 'Minimalist Floating Diamond Pendant', 'minimalist-floating-diamond-pendant', 'pendants', 'Solitaire Pendants', 'Daily Luxe', 'Sleek 18K yellow gold necklace with a floating solitaire bezel pendant engineered for daily office wear.', 'Chain Length: 16-18 Inches Adjustable', 2.800, 2.950, '18K', '["14K", "18K"]', 'yellow', '["yellow", "rose", "white"]', 'percent', 12.00, 0.00, 10.00, 'SM750PD28', 'IGI Certified', 4.85, 19, 1, 1, 'Women', 'Minimalist Office'),
('SM-105', 'Swarn Mahal Traditional Mangalsutra', 'swarn-mahal-traditional-mangalsutra', 'necklaces', 'Mangalsutra', 'Sacred Vows', 'Authentic 22K gold mangalsutra with black onyx protection beads and handcrafted gold motif pendant.', 'Chain Length: 18 Inches', 14.800, 16.500, '22K', '["22K"]', 'yellow', '["yellow"]', 'percent', 14.00, 0.00, 10.00, 'SM916MS148', 'BIS 916 HALLMARK', 5.00, 64, 1, 0, 'Women', 'Sacred Mangalsutra'),
('SM-106', 'Floral Diamond Cocktail Ring', 'floral-diamond-cocktail-ring', 'rings', 'Cocktail Rings', 'Garden of Eden', 'Intricate floral cluster ring featuring VVS-GH brilliant cut diamonds handset in 18K yellow gold.', 'Crown Width: 16mm', 5.200, 5.600, '18K', '["18K"]', 'yellow', '["yellow", "rose", "white"]', 'percent', 15.00, 0.00, 5.00, 'SM750FR520', 'IGI Certified', 4.90, 15, 0, 1, 'Women', 'Cocktail Glamour'),
('SM-107', '24K Laxmi Ganesh 10g Gold Coin', '24k-laxmi-ganesh-10g-gold-coin', 'bullion', 'Gold Coins', '24K Assayed Coins', '99.9% 24K Pure Gold coin embossed with Lord Ganesha and Goddess Lakshmi. Sealed in NABL assayed blister card.', 'Diameter: 22mm | Thickness: 1.8mm', 10.000, 10.000, '24K', '["24K"]', 'yellow', '["yellow"]', 'percent', 4.00, 0.00, 0.00, 'SM999C1001', 'NABL / BIS 24K ASSAY', 5.00, 112, 1, 1, 'Unisex', 'Bullion Investment'),
('SM-108', 'Swarn Mahal 22K Handcrafted Gold Kada (Pair)', 'swarn-mahal-22k-handcrafted-gold-kada-pair', 'bangles', 'Kadas', 'Maharaja Collection', 'Solid 22K gold screw-hinge kadas featuring royal lion head karigari and antique gold Polish.', 'Inner Diameter: 2.4 / 2.6 Indian Size', 24.500, 25.000, '22K', '["22K"]', 'yellow', '["yellow"]', 'percent', 15.00, 0.00, 10.00, 'SM916KD245', 'BIS 916 HALLMARK', 5.00, 28, 1, 1, 'Unisex', 'Royal Kada'),
('SM-109', 'Eternal Diamond Pavé Eternity Band', 'eternal-diamond-pave-eternity-band', 'rings', 'Eternity Bands', 'Infinite Love', 'A continuous band of pavé-set round brilliant diamonds in 18K white gold.', 'Band Width: 2.8mm', 3.100, 3.350, '18K', '["14K", "18K"]', 'white', '["yellow", "rose", "white"]', 'percent', 12.00, 0.00, 10.00, 'SM750EB310', 'SGL Certified', 4.88, 22, 1, 0, 'Women', 'Eternity Band'),
('SM-110', 'Zambian Emerald Solitaire Halo Ring', 'zambian-emerald-solitaire-halo-ring', 'rings', 'Gemstone Rings', 'Royal Gemstone', 'A vivid green Zambian emerald surrounded by a sparkling halo of diamonds in 18K yellow gold.', 'Emerald Size: 7x5mm', 4.600, 5.150, '18K', '["18K"]', 'yellow', '["yellow", "rose"]', 'percent', 15.00, 0.00, 10.00, 'SM750EM460', 'IGI Certified', 4.92, 17, 1, 1, 'Women', 'Royal Gemstone'),
('SM-111', 'Royal Kundan & Polki Bridal Choker Set', 'royal-kundan-polki-bridal-choker-set', 'necklaces', 'Chokers', 'Maharani Trousseau', 'Grand handcrafted Kundan choker with uncut polki diamonds, natural emerald beads, and pearl drops.', 'Flexible Velvet Backstrap', 34.200, 39.800, '22K', '["22K"]', 'yellow', '["yellow"]', 'percent', 18.00, 0.00, 15.00, 'SM916KL342', 'BIS 916 HALLMARK', 5.00, 51, 1, 1, 'Women', 'Bridal Choker');

-- 5. PUSH PRODUCT IMAGES
INSERT INTO `product_images` (`product_id`, `yellow_gold_image`, `rose_gold_image`, `white_gold_image`, `hover_image`, `gallery_images`) VALUES
('SM-101', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"]'),
('SM-102', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg', NULL, NULL, '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg', '["/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg"]'),
('SM-103', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=85"]'),
('SM-104', 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1611591475155-4286fa7c2e7f?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=85"]'),
('SM-105', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg', NULL, NULL, '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg', '["/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg"]'),
('SM-106', 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=85"]'),
('SM-107', 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=85"]'),
('SM-108', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg', NULL, NULL, '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg', '["/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (2).jpeg"]'),
('SM-109', 'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=1200&q=85"]'),
('SM-110', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', NULL, NULL, 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', '["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85"]'),
('SM-111', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg', NULL, NULL, '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg', '["/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg"]');

-- 6. PUSH DIAMOND SPECS
INSERT INTO `diamond_specs` (`product_id`, `stone_count`, `total_carat_weight`, `clarity`, `cut`, `price_per_carat`) VALUES
('SM-101', 1, 0.350, 'VVS-EF', 'Round Brilliant', 68000.00),
('SM-104', 1, 0.200, 'VVS-EF', 'Round Bezel', 62000.00),
('SM-106', 28, 0.520, 'VS-GH', 'Round & Marquise', 58000.00),
('SM-109', 32, 0.300, 'VS-GH', 'Round Pavé', 54000.00),
('SM-110', 16, 0.280, 'VVS-EF', 'Halo Round', 64000.00);

-- 7. PUSH GEMSTONE SPECS
INSERT INTO `gemstone_specs` (`product_id`, `stone_type`, `weight_carat`, `price_per_carat`) VALUES
('SM-110', 'Natural Zambian Emerald', 1.250, 22000.00),
('SM-111', 'Uncut Jadau Polki & Natural Emerald Beads', 12.400, 18000.00);

-- 8. PUSH NAV CATEGORY MAPPING
INSERT INTO `product_nav_categories` (`product_id`, `nav_category_slug`) VALUES
('SM-101', 'all'), ('SM-101', 'diamond'), ('SM-101', 'gifting'), ('SM-101', 'under-50k'),
('SM-102', 'all'), ('SM-102', 'gold'), ('SM-102', 'wedding'),
('SM-103', 'all'), ('SM-103', 'gold'), ('SM-103', 'earrings'),
('SM-104', 'all'), ('SM-104', 'diamond'), ('SM-104', 'daily-wear'), ('SM-104', 'gifting'), ('SM-104', 'under-50k'),
('SM-105', 'all'), ('SM-105', 'gold'), ('SM-105', 'wedding'),
('SM-106', 'all'), ('SM-106', 'diamond'), ('SM-106', 'gifting'),
('SM-107', 'all'), ('SM-107', 'gold'), ('SM-107', 'gifting'), ('SM-107', 'under-50k'),
('SM-108', 'all'), ('SM-108', 'gold'), ('SM-108', 'wedding'),
('SM-109', 'all'), ('SM-109', 'diamond'), ('SM-109', 'gifting'), ('SM-110', 'under-50k'),
('SM-110', 'all'), ('SM-110', 'gemstone'), ('SM-110', 'gifting'), ('SM-110', 'under-50k'),
('SM-111', 'all'), ('SM-111', 'wedding'), ('SM-111', 'gold'), ('SM-111', 'gemstone');

-- 9. PUSH SHOWROOM GALLERY BENTO ITEMS
INSERT INTO `showroom_gallery` (`gallery_code`, `title`, `category`, `badge`, `span_class`, `image_url`, `description`, `specs_text`, `display_order`) VALUES
('gal-1', '22K Royal Bridal Rani Haar Suite', 'bridal', '22K BIS 916', 'span-tall', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (1).jpeg', 'Authentic handcrafted bridal necklaces and rani haar suites crafted by master karigars for North Chhattisgarh weddings.', '28.5g Net Gold • 916 Hallmark HUID', 1),
('gal-2', 'Swarn Mahal Luxury Ambience & Lounge', 'showroom', 'Ambikapur Flagship', 'span-wide', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (10).jpeg', 'Explore North Chhattisgarh premier luxury jewellery destination on Church Road, Joda Pipal, Maharaja Gali.', 'Private VIP Bays • 100% Purity Certified', 2),
('gal-3', 'Traditional Sacred Mangalsutras', 'mangalsutra', 'Sacred Vows', 'span-square', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (14).jpeg', 'Intricate black onyx bead strands interwoven with 22K pure gold pendants.', '14.8g Gold • 22K Hallmark', 3),
('gal-4', 'Precision Digital Karat Weighing', 'showroom', '100% Transparency', 'span-square', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (11).jpeg', 'State-of-the-art electronic scales providing 100% transparent weight and live bullion pricing.', 'BIS Verified Weighing • Zero Hidden Charges', 4),
('gal-5', 'Solitaire Diamond & Cocktail Rings', 'solitaire', 'IGI Certified', 'span-wide', 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=85', 'Round brilliant cut solitaires set in glowing 18K yellow, rose, and white gold bands.', 'VVS-EF Clarity • 18K Gold', 5),
('gal-6', 'Wall Display Busts & Royal Chokers', 'showroom', 'Showroom Vault', 'span-tall', '/asset/WhatsApp Image 2026-08-13 at 12.17.43 PM (8).jpeg', 'A stunning showcase of bridal sets, heavy gold necklaces, and temple jewellery on display.', 'Heritage Collection • Ambikapur', 6);

-- 10. PUSH SITE SETTINGS & BRANDING
INSERT INTO `site_settings` (`setting_key`, `setting_value`, `description`) VALUES
('site_logo_text', 'SWARN MAHAL', 'Main logo brand title'),
('site_logo_subtext', 'SAWARN LUXURY JEWELS • AMBIKAPUR', 'Subtitle under logo'),
('site_logo_symbol', 'SM', 'Logo badge monogram initials'),
('site_logo_image', '/asset/logo.jpg', 'Custom logo image URL'),
('store_name', 'Swarn Mahal Jewellers', 'Legal store name'),
('store_tagline', 'Sawarn Luxury Jewels & Heritage Bullion', 'Brand slogan/tagline'),
('store_city', 'Ambikapur', 'Store city'),
('store_address', 'Church Road, Joda Pipal, Maharaja Gali, Ambikapur, Chhattisgarh - 497001', 'Full showroom address'),
('store_phone', '+91 99997 77740 / +91 7774-241216', 'Contact numbers'),
('store_whatsapp', '+91 99997 77740', 'WhatsApp business number'),
('store_email', 'contact@swarnmahalambikapur.com', 'Official email'),
('store_timing', 'Mon - Sun: 09:00 AM - 09:00 PM (Open All 7 Days)', 'Showroom timings'),
('store_gstin', '22AABCJ9823Q1Z4', 'GSTIN number'),
('footer_about', 'Ambikapur premier destination for 22K BIS 916 hallmarked luxury gold heirlooms, certified IGI diamond solitaires, and 24K pure bullion investment coins.', 'Footer bio description'),
('footer_copyright', '© 2026 Swarn Mahal Jewellers. All Rights Reserved.', 'Copyright notice');
