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
 'https://sun9-10.userapi.com/s/v1/ig2/AgNF_IcG-Lex0a0IkfShIK42mT1O1ptL3Z0N5MhgMPJjBL-Lbt4YyPebse_2eFIqXRVXx_QTOs2BrXd2t490B2uS.jpg?quality=95&crop=0,0,1920,1080&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0',
 '["https://sun9-21.userapi.com/s/v1/ig2/wgrYZiCJSnfllfXxkypeSnb3o6EU4KrQq5TBlY-1aOE9YKRlpXyLBtuC0i4rKg9ftT7IlgKYYtb_AGk3_WZ1u4Lt.jpg?quality=95&as=32x32,48x48,72x72,108x108,160x160,240x240,360x360,480x480,540x540,640x640,720x720,1080x1080&from=bu&cs=1080x0", 
   "https://sun9-48.userapi.com/s/v1/ig2/0-VfZhNe-YgXS9DsSSVJkjzmNN9obuvIlpmtfjSPZcSKmWJmXW6O4abyDU6-VY3iGj5kxtJeRRcAsq4SM-YK1hGP.jpg?quality=95&as=32x42,48x62,72x94,108x140,160x208,240x312,360x468,480x624,540x702,640x832,720x936,831x1080&from=bu&cs=831x0"]', 
 85000, 
 '4K', 
 '["FBX", "OBJ"]', 
 234, 
 4.5),

('Фильтр', 
 990, 
 'Детализированная 3D-модель нефтегазового фильтра. Подходит для визуализации трубопроводных линий.',
 'Нефть', 
 'https://sun9-55.userapi.com/s/v1/ig2/r0uPiiQy6x8SDZQC2jhHq6PcCywYMfdF_btqt9Hfw0pUmhp-VWc3-NHqFw0KVqYcPEVp13C2lWTAhEej7X9zTkUH.jpg?quality=95&as=32x32,48x48,72x73,108x109,160x161,240x242,360x363,480x484,540x544,640x645,720x725,1072x1080&from=bu&cs=1072x0',
 '["https://sun9-49.userapi.com/s/v1/ig2/HUrqxppFYthn0xn14bVuEKPCpmHT7SXNRzerlAujh3enrO2KM5npuKKF88QlAQ6-GCYqeuRa0m694bEH_NJTcdNe.jpg?quality=95&as=32x32,48x48,72x73,108x109,160x161,240x242,360x363,480x484,540x544,640x645,720x725,1072x1080&from=bu&cs=1072x0", 
   "https://sun9-43.userapi.com/s/v1/ig2/ded0gvKdmdE5xbL4s1sjXPBoC38zKkWHSkgjvUy4-mhq0fh67pMhMjUHPuEUpytWOIEbQ-QmzKQbTjW2HdnRvnJ0.jpg?quality=95&as=32x32,48x48,72x73,108x109,160x161,240x242,360x363,480x484,540x544,640x645,720x725,1072x1080&from=bu&cs=1072x0"]', 
 15000, 
 '2K', 
 '["FBX", "OBJ"]', 
 234, 
 4.5),

('Резервуар', 
 510, 
 'Промышленный резервуар для хранения жидкостей. Идеально для индустриальной визуализации.',
 'Нефть', 
 'https://sun9-40.userapi.com/s/v1/ig2/2A4o3nBfKuP45w0yANr342w7s6Y-bQE3SuHh_NcXm_6yWNjq4dtRCLnyly6es4vWwskUfBVA0gqgjMsCOg5YaRiq.jpg?quality=95&as=32x18,48x27,72x40,108x61,160x90,240x135,360x202,480x270,540x304,640x360,720x405,1080x607,1280x720,1440x810,1920x1080&from=bu&cs=1920x0',
 '["https://sun9-78.userapi.com/s/v1/ig2/HIbZFZSXigqGpz6WwHxG6o8qKFkf9z0TWBN0gD5jvCveF_59yczsi9L3_0ucQqv3tKze7b407O1VncNpIvp_4Z5v.jpg?quality=95&as=32x33,48x49,72x74,108x111,160x165,240x247,360x371,480x495,540x557,640x660,720x742,1076x1109&from=bu&cs=1076x0g", 
   "https://sun9-15.userapi.com/s/v1/ig2/VdHlyoQ1a_r4ZxCsT3lUonAoCQR0xrU3B1soGWYXo1U-sxIKo72YdyIL45Lq8UQUQjv34ar4CErtfvz1_22-159y.jpg?quality=95&as=32x23,48x34,72x52,108x77,160x114,240x172,360x258,480x343,540x386,640x458,720x515,1080x773,1280x916,1440x1030,1550x1109&from=bu&cs=1550x0ng.jpg",
   "https://sun9-34.userapi.com/s/v1/ig2/KkBRMRwTGvEk-q1l1Chn6HhCr_9YD5-zlj-a8m4xUvxXEzFyXVHChNR1lX-FoBJsHRJP176Ma_NYTDBdLW8c61Dc.jpg?quality=95&as=32x23,48x34,72x52,108x77,160x114,240x172,360x258,480x343,540x386,640x458,720x515,1080x773,1280x916,1440x1030,1550x1109&from=bu&cs=1550x0"]', 
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