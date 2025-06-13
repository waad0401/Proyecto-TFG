-- 1) Crea la base de datos si no existe
CREATE DATABASE IF NOT EXISTS `ecommers` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ecommers`;

-- 2) Tabla de usuarios
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3) Tabla de productos
CREATE TABLE IF NOT EXISTS `products` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT,
  `price` DECIMAL(10,2) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `image` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4) Tabla de pedidos
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `total` DECIMAL(12,2) NOT NULL,
  `date` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `status` VARCHAR(50) NOT NULL DEFAULT 'pending',
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`)
    ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5) Tabla intermedia order_items
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`order_id`, `product_id`),
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`)
    ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`)
    ON DELETE RESTRICT
) ENGINE=InnoDB;


INSERT INTO `products` (`name`, `description`, `price`, `stock`, `image`)
VALUES
  ('Cigarrillos Red 20',
   'Cajetilla de 20 cigarrillos con mezcla rubia clásica y filtro estándar.',
   5.20, 500, 'cigarrillos_red20.jpg'),

  ('Tabaco Picadura 50 g',
   'Bolsa de tabaco rubio para liar, formato económico de 50 g.',
   7.75, 300, 'tabaco_picadura_50g.jpg'),

  ('Papelillos Finos 120',
   'Librillo de 120 papelillos ultra finos, combustión lenta (King Size).',
   1.30, 800, 'papelillos_finos_120.jpg'),

  ('Filtros Extra Long 150',
   'Bolsa de 150 filtros extra largos de 8 mm para reducir nicotina y alquitrán.',
   1.90, 0, 'filtros_extralong_150.jpg'),

  ('Encendedor Metálico Recargable',
   'Encendedor metálico a gas, llama regulable y recargable, varios colores.',
   3.50, 200, 'encendedor_metalico.jpg');

