-- Insert sample store themes
INSERT INTO store_themes (name, description, preview_image, template_data, is_premium) VALUES
('Modern Minimal', 'Clean and modern design perfect for fashion and lifestyle brands', '/themes/modern-minimal.jpg', '{"colors": {"primary": "#3B82F6", "secondary": "#F59E0B"}, "fonts": {"heading": "Inter", "body": "Inter"}, "layout": "minimal"}', false),
('Nigerian Heritage', 'Celebrate Nigerian culture with traditional patterns and colors', '/themes/nigerian-heritage.jpg', '{"colors": {"primary": "#3B82F6", "secondary": "#DC2626"}, "fonts": {"heading": "Playfair Display", "body": "Inter"}, "layout": "cultural"}', false),
('Tech Store', 'Perfect for electronics and gadget stores', '/themes/tech-store.jpg', '{"colors": {"primary": "#3B82F6", "secondary": "#1F2937"}, "fonts": {"heading": "Inter", "body": "Inter"}, "layout": "tech"}', false),
('Artisan Craft', 'Showcase handmade products with warm, earthy tones', '/themes/artisan-craft.jpg', '{"colors": {"primary": "#92400E", "secondary": "#F59E0B"}, "fonts": {"heading": "Playfair Display", "body": "Inter"}, "layout": "artisan"}', true),
('Beauty & Wellness', 'Elegant design for beauty and wellness products', '/themes/beauty-wellness.jpg', '{"colors": {"primary": "#EC4899", "secondary": "#8B5CF6"}, "fonts": {"heading": "Playfair Display", "body": "Inter"}, "layout": "beauty"}', true);

-- Insert sample user
INSERT INTO users (id, email, first_name, last_name, phone) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'adunni@example.com', 'Adunni', 'Okafor', '+2348012345678');

-- Insert sample store
INSERT INTO stores (id, name, slug, description, category, owner_id, plan, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Adunni Fashions', 'adunnifashions', 'Premium Nigerian fashion and traditional wear', 'Fashion & Clothing', '550e8400-e29b-41d4-a716-446655440000', 'pro', 'active');

-- Insert sample products
INSERT INTO products (store_id, name, description, category, price, compare_price, stock_quantity, tags, images, status) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Ankara Dress Set', 'Beautiful Ankara dress set perfect for special occasions. Made with high-quality African print fabric.', 'Fashion & Clothing', 25000.00, 30000.00, 15, ARRAY['ankara', 'dress', 'fashion', 'african'], ARRAY['/products/ankara-dress-1.jpg', '/products/ankara-dress-2.jpg'], 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Traditional Cap', 'Authentic Nigerian traditional cap (Fila) made with premium materials.', 'Accessories', 8500.00, 10000.00, 32, ARRAY['cap', 'traditional', 'fila', 'accessories'], ARRAY['/products/traditional-cap-1.jpg'], 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Gele Headwrap', 'Premium gele headwrap for traditional ceremonies and events.', 'Accessories', 12000.00, 15000.00, 0, ARRAY['gele', 'headwrap', 'traditional', 'ceremony'], ARRAY['/products/gele-1.jpg', '/products/gele-2.jpg'], 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Agbada Complete Set', 'Complete Agbada set with embroidery, perfect for special occasions.', 'Fashion & Clothing', 45000.00, 55000.00, 8, ARRAY['agbada', 'traditional', 'embroidery', 'formal'], ARRAY['/products/agbada-1.jpg', '/products/agbada-2.jpg', '/products/agbada-3.jpg'], 'active'),
('550e8400-e29b-41d4-a716-446655440001', 'Beaded Necklace', 'Handcrafted beaded necklace with traditional Nigerian patterns.', 'Jewelry & Accessories', 15000.00, NULL, 25, ARRAY['beads', 'necklace', 'jewelry', 'handcrafted'], ARRAY['/products/beaded-necklace-1.jpg'], 'draft');

-- Insert sample customers
INSERT INTO customers (email, first_name, last_name, phone) VALUES
('customer1@example.com', 'Emeka', 'Johnson', '+2348023456789'),
('customer2@example.com', 'Fatima', 'Abdul', '+2348034567890'),
('customer3@example.com', 'Chidi', 'Okwu', '+2348045678901');

-- Insert sample orders
INSERT INTO orders (store_id, customer_id, order_number, status, total_amount, subtotal, currency, payment_status) VALUES
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM customers WHERE email = 'customer1@example.com'), 'ORD-001', 'completed', 25000.00, 25000.00, 'NGN', 'paid'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM customers WHERE email = 'customer2@example.com'), 'ORD-002', 'processing', 8500.00, 8500.00, 'NGN', 'paid'),
('550e8400-e29b-41d4-a716-446655440001', (SELECT id FROM customers WHERE email = 'customer3@example.com'), 'ORD-003', 'pending', 12000.00, 12000.00, 'NGN', 'pending');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, product_name, quantity, price, total) VALUES
((SELECT id FROM orders WHERE order_number = 'ORD-001'), (SELECT id FROM products WHERE name = 'Ankara Dress Set'), 'Ankara Dress Set', 1, 25000.00, 25000.00),
((SELECT id FROM orders WHERE order_number = 'ORD-002'), (SELECT id FROM products WHERE name = 'Traditional Cap'), 'Traditional Cap', 1, 8500.00, 8500.00),
((SELECT id FROM orders WHERE order_number = 'ORD-003'), (SELECT id FROM products WHERE name = 'Gele Headwrap'), 'Gele Headwrap', 1, 12000.00, 12000.00);

-- Insert sample analytics events
INSERT INTO analytics_events (store_id, event_type, event_data) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'page_view', '{"page": "/", "user_agent": "Mozilla/5.0"}'),
('550e8400-e29b-41d4-a716-446655440001', 'product_view', '{"product_id": "ankara-dress-set", "product_name": "Ankara Dress Set"}'),
('550e8400-e29b-41d4-a716-446655440001', 'add_to_cart', '{"product_id": "ankara-dress-set", "quantity": 1}'),
('550e8400-e29b-41d4-a716-446655440001', 'purchase', '{"order_id": "ORD-001", "total": 25000.00}');
