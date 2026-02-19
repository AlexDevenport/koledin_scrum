TRUNCATE TABLE orders, products, users RESTART IDENTITY CASCADE;

INSERT INTO users (first_name, last_name, email, hashed_password) VALUES
('Ivan', 'Petrov', 'ivan@example.com', 'hashed_pw1'),
('Anna', 'Smirnova', 'anna@example.com', 'hashed_pw2');

INSERT INTO products (name, price, description) VALUES
('Продукт 1', 10.99, 'Супер-мега-продукт 1'),
('Продукт 2', 15.99, 'Супер-мега-продукт 2'),
('Продукт 3', 7.49, 'Супер-мега-продукт 3'),
('Продукт 4', 25.00, 'Супер-мега-продукт 4');

INSERT INTO orders (product_id, user_id, amount) VALUES
(1, 1, 2),
(2, 1, 1),
(3, 2, 5),
(1, 2, 1);