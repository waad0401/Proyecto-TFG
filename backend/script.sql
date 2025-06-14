/* 1) Base de datos */
CREATE DATABASE IF NOT EXISTS `ecommers`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ecommers`;

/* 2) Tabla de usuarios */
CREATE TABLE IF NOT EXISTS `users` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`      VARCHAR(100)  NOT NULL,
  `correo`      VARCHAR(150)  NOT NULL UNIQUE,
  `contrasena`  VARCHAR(255)  NOT NULL,
  `creado_en`   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* 3) Tabla de productos */
CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`      VARCHAR(150) NOT NULL,
  `descripcion` TEXT,
  `precio`      DECIMAL(10,2) NOT NULL,
  `stock`       INT NOT NULL DEFAULT 0,
  `imagen`      VARCHAR(255),
  `creado_en`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

/* 4) Tabla de pedidos */
CREATE TABLE IF NOT EXISTS `orders` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `total`      DECIMAL(12,2) NOT NULL,
  `fecha`      DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado`     VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

/* 5) Tabla intermedia items de pedido */
CREATE TABLE IF NOT EXISTS `order_items` (
  `pedido_id`   INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad`    INT NOT NULL,
  `precio`      DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`pedido_id`, `producto_id`),
  FOREIGN KEY (`pedido_id`)   REFERENCES `orders`   (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB;

/* 6) Carritos */
CREATE TABLE IF NOT EXISTS `carts` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT NOT NULL,
  `creado_en`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `cart_items` (
  `carrito_id` INT NOT NULL,
  `producto_id` INT NOT NULL,
  `cantidad`    INT NOT NULL,
  PRIMARY KEY (`carrito_id`, `producto_id`),
  FOREIGN KEY (`carrito_id`)  REFERENCES `carts`   (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
);

/* 7) Comentarios de producto */
CREATE TABLE IF NOT EXISTS `comments` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT  NOT NULL,
  `usuario_id`  INT  NOT NULL,
  `contenido`   TEXT NOT NULL,
  `creado_en`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`)  REFERENCES `users`   (`id`) ON DELETE CASCADE
);

INSERT INTO `products` (`nombre`, `descripcion`, `precio`, `stock`, `imagen`)
VALUES
  ('Cigarrillos Red 20',
   'Cajetilla de 20 cigarrillos con mezcla rubia clásica y filtro estándar.',
   5.20, 500, 'cigarrillos_red20.jpg'),

  ('Amphora',
   'Paquete de Amphora, un tabaco masticable de lo más exquisito.',
   7.75, 300, 'amphora_tabaco_masticable.jpg'),

  ('Frasco de nicotina',
   'Frasco de nicotina para su libre uso y consumo.',
   1.30, 800, 'tabaco_liquid.jpg'),

  ('Aandria PACK',
   'Paquete con 5 cajetillas de Aandria.',
   1.90, 0, 'aandria_paquete.jpg'),

  ('Cenicero metálico',
   'Cenicero metálico de latón con decoración victoriana.',
   3.50, 200, 'cenicero_metalico.jpg');
