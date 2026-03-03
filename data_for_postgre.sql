-- 1. Очистка таблиц
TRUNCATE TABLE 
    order_items, 
    orders, 
    favorites, 
    products, 
    users 
RESTART IDENTITY CASCADE;


-- 2. Пользователи
INSERT INTO users (first_name, last_name, email, hashed_password, bonus_points) VALUES
('Иван',     'Петров',    'ivan@example.com',     'pbkdf2_sha256$600000$salt$hash1',  150),
('Анна',     'Смирнова',  'anna@example.com',     'pbkdf2_sha256$600000$salt$hash2',   80);


-- 3. Товары (3D-модели)
INSERT INTO products (
    name, 
    price, 
    description, 
    category, 
    preview_image, 
    images, 
    polygons_count, 
    texture_quality, 
    formats, 
    views_count, 
    rating
) VALUES

('Терминал', 
 340, 
 'Современный терминал для аэропорта или банка. Современнейший терминал для аэропорта или банка.',
 'Архитектура', 
 'https://preview.free3d.com/img/2022/01/3190215078263653402/3i3rlz0o.jpg',  -- реалистичный self-check-in терминал
 '["https://preview.free3d.com/img/2022/01/3190215078263653402/zr88s6wv.jpg", 
   "https://preview.free3d.com/img/2022/01/3190215078263653402/vfawtqda.jpg", 
   "https://media.cgtrader.com/variants/l56b5luo56viu26l5mz1ocdhtc34/78add9c2f02fbd73a43ffb3970be38683c5f15eff6ca849dc78c644f4ff9ce1b/StudioC_00015.webp"]', 
 85000, 
 '4K', 
 '["FBX", "OBJ"]', 
 234, 
 4.5),

('Фильтр', 
 990, 
 'Детализированная 3D-модель нефтегазового фильтра. Подходит для визуализации трубопроводных линий.',
 'Нефть', 
 'https://c8.alamy.com/comp/2A5EJKN/blue-industrial-pipelines-with-valves-on-white-background-digital-render-image-2A5EJKN.jpg',  -- синие трубы/фильтр
 '["https://thumbs.dreamstime.com/b/d-model-depicts-complex-industrial-control-system-showcasing-intricate-piping-valves-control-panels-detailed-385800343.jpg", 
   "https://img-new.cgtrader.com/items/4957280/20c7c0f548/modular-oil-and-gas-processing-plant-equipment-3d-model-20c7c0f548.webp"]', 
 15000, 
 '2K', 
 '["FBX", "OBJ"]', 
 234, 
 4.5),

('Резервуар', 
 510, 
 'Промышленный резервуар для хранения жидкостей. Идеально для индустриальной визуализации.',
 'Нефть', 
 'https://p.turbosquid.com/ts-thumb/zY/ZER5Hs/m7/crudeoilstoragetankvray3dmodel001/jpg/1693291944/1920x1080/fit_q87/afb38f1a20a8fabebfc1a41435a9eadc95cc78aa/crudeoilstoragetankvray3dmodel001.jpg',  -- классический нефтяной танк
 '["https://preview.free3d.com/img/2023/08/3191688956689253518/l0kz6hbg.jpg", 
   "https://thumbs.dreamstime.com/b/generated-image-428199918.jpg"]', 
 55000, 
 '4K', 
 '["FBX", "OBJ"]', 
 234, 
 4.5);


-- 4. Заказы (orders + order_items)
-- Заказ 1 (Иван) — купил терминал и резервуар
INSERT INTO orders (user_id, total_sum) VALUES (1, 340 + 510);  -- 850
INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES
(1, 1, 1, 340),   -- Терминал
(1, 3, 1, 510);   -- Резервуар


-- Заказ 2 (Иван) — купил только фильтр (самый дорогой)
INSERT INTO orders (user_id, total_sum) VALUES (1, 990);  
INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES
(2, 2, 1, 990);   -- Фильтр


-- Заказ 3 (Анна) — купила терминал
INSERT INTO orders (user_id, total_sum) VALUES (2, 340);  
INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES
(3, 1, 1, 340);   -- Терминал


-- Заказ 4 (Анна) — купила всё сразу (большой заказ)
INSERT INTO orders (user_id, total_sum) VALUES (2, 340 + 990 + 510);  -- 1840
INSERT INTO order_items (order_id, product_id, quantity, price_at_buy) VALUES
(4, 1, 1, 340),   -- Терминал
(4, 2, 1, 990),   -- Фильтр
(4, 3, 2, 510);   -- Резервуар ×2


-- 5. Избранное (favorites) — что пользователи добавили в избранное
INSERT INTO favorites (user_id, product_id) VALUES
(1, 2),    -- Иван добавил Фильтр в избранное
(1, 3),    -- Иван добавил Резервуар
(2, 1),    -- Анна добавила Терминал
(2, 3),    -- Анна добавила Резервуар
(1, 1);    -- Иван также присмотрелся к Терминалу