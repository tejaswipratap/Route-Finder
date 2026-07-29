-- ============================================================
-- ROUTE FINDER - SHORTEST PATH VISUALIZER
-- Database Schema & Sample Dataset
-- MySQL 8.0 / MariaDB Compatible
-- ============================================================

CREATE DATABASE IF NOT EXISTS `route_finder` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `route_finder`;

-- ------------------------------------------------------------
-- Table: admins
-- Stores admin accounts for graph management
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Password for 'admin' is 'admin123' (hashed using PHP password_hash PASSWORD_BCRYPT)
INSERT INTO `admins` (`id`, `username`, `password`, `name`) VALUES
(1, 'admin', '$2y$10$e0MYzXyjpJS7Pd0RVvHwHe10P7aJv3u2HkUu8hU4Xk2hS2O2pQ9mO', 'System Administrator');

-- ------------------------------------------------------------
-- Table: cities
-- Stores nodes (cities) in the graph with visual canvas coordinates
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `cities`;
CREATE TABLE `cities` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL UNIQUE,
    `state` VARCHAR(100) DEFAULT '',
    `pos_x` FLOAT DEFAULT 100,
    `pos_y` FLOAT DEFAULT 100,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed 20 major Indian Cities with spatial layout coordinates (X, Y)
INSERT INTO `cities` (`id`, `name`, `state`, `pos_x`, `pos_y`) VALUES
(1,  'Delhi',        'Delhi',           450, 150),
(2,  'Agra',         'Uttar Pradesh',   520, 240),
(3,  'Jaipur',       'Rajasthan',       320, 220),
(4,  'Lucknow',      'Uttar Pradesh',   680, 240),
(5,  'Kanpur',       'Uttar Pradesh',   630, 290),
(6,  'Varanasi',     'Uttar Pradesh',   800, 310),
(7,  'Chandigarh',   'Punjab',          420, 80),
(8,  'Dehradun',     'Uttarakhand',     530, 90),
(9,  'Bhopal',       'Madhya Pradesh',  460, 390),
(10, 'Indore',       'Madhya Pradesh',  380, 420),
(11, 'Ahmedabad',    'Gujarat',         220, 400),
(12, 'Mumbai',       'Maharashtra',     230, 560),
(13, 'Pune',         'Maharashtra',     300, 600),
(14, 'Nagpur',       'Maharashtra',     580, 460),
(15, 'Hyderabad',    'Telangana',       520, 640),
(16, 'Bengaluru',    'Karnataka',       450, 780),
(17, 'Chennai',      'Tamil Nadu',      580, 790),
(18, 'Kolkata',      'West Bengal',     920, 380),
(19, 'Patna',        'Bihar',           820, 240),
(20, 'Ranchi',       'Jharkhand',       840, 340);

-- ------------------------------------------------------------
-- Table: roads
-- Stores weighted bidirectional edges connecting cities (distances in KM)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `roads`;
CREATE TABLE `roads` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `source_id` INT NOT NULL,
    `destination_id` INT NOT NULL,
    `distance` INT NOT NULL,
    `road_type` VARCHAR(50) DEFAULT 'National Highway',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`source_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE,
    FOREIGN KEY (`destination_id`) REFERENCES `cities`(`id`) ON DELETE CASCADE,
    UNIQUE KEY `unique_road` (`source_id`, `destination_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed realistic connections and distances (KM)
INSERT INTO `roads` (`source_id`, `destination_id`, `distance`, `road_type`) VALUES
-- North Region
(1, 7, 244, 'NH 44'),   -- Delhi <-> Chandigarh
(1, 8, 255, 'NH 334'),  -- Delhi <-> Dehradun
(1, 3, 280, 'NH 48'),   -- Delhi <-> Jaipur
(1, 2, 240, 'Yamuna Exp'),-- Delhi <-> Agra
(7, 8, 170, 'NH 7'),    -- Chandigarh <-> Dehradun
(3, 2, 240, 'NH 21'),   -- Jaipur <-> Agra
(3, 10, 525, 'NH 52'),  -- Jaipur <-> Indore

-- Central & East Region
(2, 4, 335, 'Agra Exp'),-- Agra <-> Lucknow
(2, 5, 278, 'NH 19'),   -- Agra <-> Kanpur
(4, 5, 90,  'NH 27'),   -- Lucknow <-> Kanpur
(4, 6, 320, 'NH 30'),   -- Lucknow <-> Varanasi
(4, 19, 530, 'NH 27'),  -- Lucknow <-> Patna
(5, 6, 330, 'NH 19'),   -- Kanpur <-> Varanasi
(6, 19, 250, 'NH 19'),  -- Varanasi <-> Patna
(6, 20, 360, 'NH 39'),  -- Varanasi <-> Ranchi
(19, 20, 330, 'NH 22'), -- Patna <-> Ranchi
(19, 18, 580, 'NH 19'), -- Patna <-> Kolkata
(20, 18, 400, 'NH 16'), -- Ranchi <-> Kolkata

-- Central & West Region
(2, 9, 540, 'NH 44'),   -- Agra <-> Bhopal
(9, 10, 190, 'State Hwy'),-- Bhopal <-> Indore
(9, 14, 350, 'NH 46'),  -- Bhopal <-> Nagpur
(10, 11, 390, 'NH 47'), -- Indore <-> Ahmedabad
(11, 12, 530, 'NH 48'), -- Ahmedabad <-> Mumbai
(12, 13, 150, 'Mumbai-Pune Exp'), -- Mumbai <-> Pune
(13, 15, 560, 'NH 65'), -- Pune <-> Hyderabad

-- Central & South Region
(14, 15, 500, 'NH 44'), -- Nagpur <-> Hyderabad
(14, 20, 700, 'NH 53'), -- Nagpur <-> Ranchi
(15, 16, 570, 'NH 44'), -- Hyderabad <-> Bengaluru
(15, 17, 630, 'NH 65'), -- Hyderabad <-> Chennai
(16, 17, 345, 'NH 48'), -- Bengaluru <-> Chennai
(16, 13, 840, 'NH 48'); -- Bengaluru <-> Pune

-- ------------------------------------------------------------
-- Table: search_history
-- Logs recent path calculations for history feature
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `search_history`;
CREATE TABLE `search_history` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `source_city` VARCHAR(100) NOT NULL,
    `destination_city` VARCHAR(100) NOT NULL,
    `algorithm` VARCHAR(50) NOT NULL,
    `distance` INT NOT NULL,
    `path_json` TEXT NOT NULL,
    `searched_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed initial search history logs
INSERT INTO `search_history` (`source_city`, `destination_city`, `algorithm`, `distance`, `path_json`) VALUES
('Delhi', 'Varanasi', 'Dijkstra', 835, '["Delhi","Agra","Lucknow","Varanasi"]'),
('Mumbai', 'Bengaluru', 'Dijkstra', 990, '["Mumbai","Pune","Bengaluru"]'),
('Chandigarh', 'Kolkata', 'Dijkstra', 1675, '["Chandigarh","Delhi","Agra","Lucknow","Patna","Kolkata"]');

-- ------------------------------------------------------------
-- Table: favorites
-- Stores user saved routes
-- ------------------------------------------------------------
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `source_city` VARCHAR(100) NOT NULL,
    `destination_city` VARCHAR(100) NOT NULL,
    `notes` VARCHAR(255) DEFAULT '',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_favorite` (`source_city`, `destination_city`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `favorites` (`source_city`, `destination_city`, `notes`) VALUES
('Delhi', 'Varanasi', 'Popular pilgrimage & heritage corridor'),
('Mumbai', 'Pune', 'Expressway frequent route');
