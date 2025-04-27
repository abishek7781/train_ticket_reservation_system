-- Database: train_reservation

CREATE DATABASE IF NOT EXISTS train_reservation;
USE train_reservation;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- Trains table
CREATE TABLE IF NOT EXISTS trains (
  id INT AUTO_INCREMENT PRIMARY KEY,
  city_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Time slots table
CREATE TABLE IF NOT EXISTS time_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  slot_time TIME NOT NULL,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

-- Seats table
CREATE TABLE IF NOT EXISTS seats (
  id INT AUTO_INCREMENT PRIMARY KEY,
  train_id INT NOT NULL,
  seat_number VARCHAR(10) NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (train_id) REFERENCES trains(id)
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  train_id INT NOT NULL,
  time_slot_id INT NOT NULL,
  seat_id INT NOT NULL,
  booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (train_id) REFERENCES trains(id),
  FOREIGN KEY (time_slot_id) REFERENCES time_slots(id),
  FOREIGN KEY (seat_id) REFERENCES seats(id)
);

-- Seed data for cities
INSERT IGNORE INTO cities (name) VALUES
('Chennai'),
('Mumbai'),
('Hyderabad'),
('Bangalore'),
('Delhi'),
('Punjab');

-- Seed data for trains (3 unique trains per city)
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Chennai Express' FROM cities WHERE name='Chennai' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Southern Star' FROM cities WHERE name='Chennai' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Bay of Bengal' FROM cities WHERE name='Chennai' LIMIT 1;

INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Mumbai Local' FROM cities WHERE name='Mumbai' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Western Flyer' FROM cities WHERE name='Mumbai' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Coastal Cruiser' FROM cities WHERE name='Mumbai' LIMIT 1;

INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Hyderabad Special' FROM cities WHERE name='Hyderabad' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Deccan Queen' FROM cities WHERE name='Hyderabad' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Nizam Express' FROM cities WHERE name='Hyderabad' LIMIT 1;

INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Bangalore Rajdhani' FROM cities WHERE name='Bangalore' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Silk Route' FROM cities WHERE name='Bangalore' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Garden City Express' FROM cities WHERE name='Bangalore' LIMIT 1;

INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Delhi Duronto' FROM cities WHERE name='Delhi' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Capital Express' FROM cities WHERE name='Delhi' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Metro Flyer' FROM cities WHERE name='Delhi' LIMIT 1;

INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Punjab Mail' FROM cities WHERE name='Punjab' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Golden Temple Express' FROM cities WHERE name='Punjab' LIMIT 1;
INSERT IGNORE INTO trains (city_id, name)
SELECT id, 'Ludhiana Local' FROM cities WHERE name='Punjab' LIMIT 1;

-- Seed data for time slots (3 per train)
INSERT IGNORE INTO time_slots (train_id, slot_time) VALUES
((SELECT id FROM trains WHERE name='Chennai Express' LIMIT 1), '08:00:00'),
((SELECT id FROM trains WHERE name='Chennai Express' LIMIT 1), '14:00:00'),
((SELECT id FROM trains WHERE name='Chennai Express' LIMIT 1), '20:00:00'),

((SELECT id FROM trains WHERE name='Southern Star' LIMIT 1), '09:00:00'),
((SELECT id FROM trains WHERE name='Southern Star' LIMIT 1), '15:00:00'),
((SELECT id FROM trains WHERE name='Southern Star' LIMIT 1), '21:00:00'),

((SELECT id FROM trains WHERE name='Bay of Bengal' LIMIT 1), '07:30:00'),
((SELECT id FROM trains WHERE name='Bay of Bengal' LIMIT 1), '13:30:00'),
((SELECT id FROM trains WHERE name='Bay of Bengal' LIMIT 1), '19:30:00'),

((SELECT id FROM trains WHERE name='Mumbai Local' LIMIT 1), '06:00:00'),
((SELECT id FROM trains WHERE name='Mumbai Local' LIMIT 1), '12:00:00'),
((SELECT id FROM trains WHERE name='Mumbai Local' LIMIT 1), '18:00:00'),

((SELECT id FROM trains WHERE name='Western Flyer' LIMIT 1), '07:00:00'),
((SELECT id FROM trains WHERE name='Western Flyer' LIMIT 1), '13:00:00'),
((SELECT id FROM trains WHERE name='Western Flyer' LIMIT 1), '19:00:00'),

((SELECT id FROM trains WHERE name='Coastal Cruiser' LIMIT 1), '08:30:00'),
((SELECT id FROM trains WHERE name='Coastal Cruiser' LIMIT 1), '14:30:00'),
((SELECT id FROM trains WHERE name='Coastal Cruiser' LIMIT 1), '20:30:00'),

((SELECT id FROM trains WHERE name='Hyderabad Special' LIMIT 1), '06:30:00'),
((SELECT id FROM trains WHERE name='Hyderabad Special' LIMIT 1), '12:30:00'),
((SELECT id FROM trains WHERE name='Hyderabad Special' LIMIT 1), '18:30:00'),

((SELECT id FROM trains WHERE name='Deccan Queen' LIMIT 1), '07:30:00'),
((SELECT id FROM trains WHERE name='Deccan Queen' LIMIT 1), '13:30:00'),
((SELECT id FROM trains WHERE name='Deccan Queen' LIMIT 1), '19:30:00'),

((SELECT id FROM trains WHERE name='Nizam Express' LIMIT 1), '08:30:00'),
((SELECT id FROM trains WHERE name='Nizam Express' LIMIT 1), '14:30:00'),
((SELECT id FROM trains WHERE name='Nizam Express' LIMIT 1), '20:30:00'),

((SELECT id FROM trains WHERE name='Bangalore Rajdhani' LIMIT 1), '06:00:00'),
((SELECT id FROM trains WHERE name='Bangalore Rajdhani' LIMIT 1), '12:00:00'),
((SELECT id FROM trains WHERE name='Bangalore Rajdhani' LIMIT 1), '18:00:00'),

((SELECT id FROM trains WHERE name='Silk Route' LIMIT 1), '07:00:00'),
((SELECT id FROM trains WHERE name='Silk Route' LIMIT 1), '13:00:00'),
((SELECT id FROM trains WHERE name='Silk Route' LIMIT 1), '19:00:00'),

((SELECT id FROM trains WHERE name='Garden City Express' LIMIT 1), '08:00:00'),
((SELECT id FROM trains WHERE name='Garden City Express' LIMIT 1), '14:00:00'),
((SELECT id FROM trains WHERE name='Garden City Express' LIMIT 1), '20:00:00'),

((SELECT id FROM trains WHERE name='Delhi Duronto' LIMIT 1), '06:30:00'),
((SELECT id FROM trains WHERE name='Delhi Duronto' LIMIT 1), '12:30:00'),
((SELECT id FROM trains WHERE name='Delhi Duronto' LIMIT 1), '18:30:00'),

((SELECT id FROM trains WHERE name='Capital Express' LIMIT 1), '07:30:00'),
((SELECT id FROM trains WHERE name='Capital Express' LIMIT 1), '13:30:00'),
((SELECT id FROM trains WHERE name='Capital Express' LIMIT 1), '19:30:00'),

((SELECT id FROM trains WHERE name='Metro Flyer' LIMIT 1), '08:30:00'),
((SELECT id FROM trains WHERE name='Metro Flyer' LIMIT 1), '14:30:00'),
((SELECT id FROM trains WHERE name='Metro Flyer' LIMIT 1), '20:30:00'),

((SELECT id FROM trains WHERE name='Punjab Mail' LIMIT 1), '06:00:00'),
((SELECT id FROM trains WHERE name='Punjab Mail' LIMIT 1), '12:00:00'),
((SELECT id FROM trains WHERE name='Punjab Mail' LIMIT 1), '18:00:00'),

((SELECT id FROM trains WHERE name='Golden Temple Express' LIMIT 1), '07:00:00'),
((SELECT id FROM trains WHERE name='Golden Temple Express' LIMIT 1), '13:00:00'),
((SELECT id FROM trains WHERE name='Golden Temple Express' LIMIT 1), '19:00:00'),

((SELECT id FROM trains WHERE name='Ludhiana Local' LIMIT 1), '08:00:00'),
((SELECT id FROM trains WHERE name='Ludhiana Local' LIMIT 1), '14:00:00'),
((SELECT id FROM trains WHERE name='Ludhiana Local' LIMIT 1), '20:00:00');

-- Seed seats for each train (20 seats per train)
DELIMITER $$
CREATE PROCEDURE seed_seats()
BEGIN
  DECLARE done INT DEFAULT FALSE;
  DECLARE train_id INT;
  DECLARE train_cursor CURSOR FOR SELECT id FROM trains;
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

  OPEN train_cursor;

  read_loop: LOOP
    FETCH train_cursor INTO train_id;
    IF done THEN
      LEAVE read_loop;
    END IF;

    SET @i = 1;
    WHILE @i <= 20 DO
      INSERT IGNORE INTO seats (train_id, seat_number, is_available) VALUES (train_id, CONCAT('S', @i), TRUE);
      SET @i = @i + 1;
    END WHILE;
  END LOOP;

  CLOSE train_cursor;
END$$
DELIMITER ;

CALL seed_seats();
DROP PROCEDURE IF EXISTS seed_seats;
