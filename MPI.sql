-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.32-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table smartwallet.categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `type` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smartwallet.categories: ~12 rows (approximately)
INSERT INTO `categories` (`id`, `name`, `type`) VALUES
	(1, 'Food & Groceries', 'EXPENSE'),
	(2, 'Housing & Rent', 'EXPENSE'),
	(3, 'Transport', 'EXPENSE'),
	(4, 'Dining Out', 'EXPENSE'),
	(5, 'Entertainment', 'EXPENSE'),
	(6, 'Shopping', 'EXPENSE'),
	(7, 'Health', 'EXPENSE'),
	(8, 'Education', 'EXPENSE'),
	(9, 'Salary', 'INCOME'),
	(10, 'Freelancing', 'INCOME'),
	(11, 'Gifts', 'INCOME'),
	(12, 'Investments', 'INCOME');

-- Dumping structure for table smartwallet.transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `transaction_date` date NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smartwallet.transactions: ~5 rows (approximately)
INSERT INTO `transactions` (`id`, `amount`, `description`, `transaction_date`, `user_id`, `category_id`) VALUES
	(1, 500.00, 'Food & Groceries', '2026-03-11', 2, 1),
	(2, 8900.00, 'Salary', '2026-03-05', 2, 9),
	(3, 330.00, 'H&M', '2026-03-23', 2, 6),
	(4, 20.00, 'PASTILE raceala', '2026-03-22', 2, 7),
	(5, 1500.00, 'Vacanta', '2026-03-19', 2, 5),
	(7, 1500.00, 'tableta', '2026-03-11', 2, 8);

-- Dumping structure for table smartwallet.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table smartwallet.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `created_at`) VALUES
	(1, 'maria_dev', 'maria@test.com', '$2a$10$x3EMP2wOQlMx/P2M1jizKu7My.KDdSpCYZKW33D5zxNcXDYuMZbp2', '2026-03-20 12:29:33'),
	(2, 'Maria', 'maria1@email.com', '$2a$10$IHhqmEnh96sFZ14MfINCuukSV6/X75Dy7jlm13PfunROueXu0Pam.', '2026-03-24 11:44:42');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
