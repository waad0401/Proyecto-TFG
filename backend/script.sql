CREATE DATABASE IF NOT EXISTS `ecommers`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ecommers`;

CREATE TABLE IF NOT EXISTS `users` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`      VARCHAR(100)  NOT NULL,
  `correo`      VARCHAR(150)  NOT NULL UNIQUE,
  `contrasena`  VARCHAR(255)  NOT NULL,
  `creado_en`   TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `products` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `nombre`      VARCHAR(150) NOT NULL,
  `descripcion` TEXT,
  `precio`      DECIMAL(10,2) NOT NULL,
  `stock`       INT NOT NULL DEFAULT 0,
  `imagen`      VARCHAR(255),
  `creado_en`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `orders` (
  `id`         CHAR(36) PRIMARY KEY       DEFAULT (UUID()),
  `usuario_id` INT NOT NULL,
  `total`      DECIMAL(12,2) NOT NULL,
  `fecha`      DATETIME DEFAULT CURRENT_TIMESTAMP,
  `estado`     VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `order_items` (
  `pedido_id`   CHAR(36) NOT NULL,
  `producto_id` INT      NOT NULL,
  `cantidad`    INT      NOT NULL,
  `precio`      DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`pedido_id`, `producto_id`),
  FOREIGN KEY (`pedido_id`)   REFERENCES `orders`   (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `carts` (
  `id`         CHAR(36) PRIMARY KEY       DEFAULT (UUID()),
  `usuario_id` INT NOT NULL,
  `creado_en`  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `cart_items` (
  `carrito_id`  CHAR(36) NOT NULL,
  `producto_id` INT      NOT NULL,
  `cantidad`    INT      NOT NULL,
  PRIMARY KEY (`carrito_id`, `producto_id`),
  FOREIGN KEY (`carrito_id`)  REFERENCES `carts`   (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`producto_id`) REFERENCES `products`(`id`) ON DELETE RESTRICT
) ENGINE = InnoDB;


CREATE TABLE IF NOT EXISTS `comments` (
  `id`          INT AUTO_INCREMENT PRIMARY KEY,
  `producto_id` INT  NOT NULL,
  `usuario_id`  INT  NOT NULL,
  `contenido`   TEXT NOT NULL,
  `creado_en`   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`producto_id`) REFERENCES `products`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`usuario_id`)  REFERENCES `users`   (`id`) ON DELETE CASCADE
) ENGINE = InnoDB;


INSERT INTO products (nombre, descripcion, precio, stock, imagen) VALUES
  ('Bombones Deluxe',
   'Caja de bombones surtidos artesanales con rellenos de caramelo, praliné y licor',
   12.50, 0, 'bombones_deluxe.webp'),
  ('Tarta de Chocolate Triple',
   'Porción de tarta de capas de bizcocho y ganache de chocolate extra oscuro',
   15.00, 1, 'tarta_chocolate_triple.webp'),
  ('Cupcakes de Vainilla',
   'Cupcakes esponjosos de vainilla con frosting de crema de mantequilla y sprinkles',
   8.00, 80, 'cupcakes_vainilla.webp'),
  ('Macarons de Colores',
   'Macarons franceses en surtido de pistacho, frambuesa, limón y mora',
   10.00, 60, 'macarons_colores.webp'),
  ('Galletas de Mantequilla',
   'Galletas caseras de mantequilla con un toque de vainilla y azúcar glas',
   5.50, 120, 'galletas_mantequilla.webp'),
  ('Pastel de Frutos Rojos',
   'Porción de pastel con mousse de frutas rojas y base de galleta crujiente',
   18.00, 30, 'pastel_frutos_rojos.webp'),
  ('Brownies con Nueces',
   'Brownies densos de chocolate con trozos de nueces y un ligero toque salado',
   9.90, 110, 'brownies_nueces.webp'),
  ('Trufas de Chocolate Negro',
   'Trufas intensas de chocolate negro recubiertas de cacao amargo',
   11.00, 90, 'trufas_chocolate_negro.webp'),
  ('Cheesecake con Fresa',
   'Cheesecake cremoso con coulis de fresa fresca y crumble de galleta',
   16.50, 40, 'cheesecake_fresa.webp'),
  ('Caramelos Artesanales',
   'Caramelos duros hechos a mano con sabores de manzana verde y limón',
   6.00, 200, 'caramelos_artesanales.webp'),
  ('Surtido de bombones',
   'Distintos tipos de bombones, entre los que se encuentra sabor a fresa chocolate y licor',
   12.50, 100, 'surtido_bombones.webp'),