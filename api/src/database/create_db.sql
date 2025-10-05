-- Cria e usa o DB
CREATE DATABASE IF NOT EXISTS ifrs_volunteers_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ifrs_volunteers_db;

-- Tabela de eventos
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(120) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  location VARCHAR(120) NOT NULL,
  capacity INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de voluntários
CREATE TABLE IF NOT EXISTS volunteers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  phone VARCHAR(20),
  role ENUM('admin', 'user') DEFAULT 'user',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de inscrições em eventos
CREATE TABLE IF NOT EXISTS event_registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  volunteer_id INT NOT NULL,
  registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE CASCADE,
  UNIQUE KEY unique_registration (event_id, volunteer_id)
);

-- Seed inicial de eventos
INSERT INTO events (title, description, event_date, location, capacity) VALUES
('Doação de Sangue', 'Campanha no Hospital Tacchinni', '2025-10-13 09:00:00', 'Hospital Tacchinni', 80),
('Mutirão Ambiental', 'Limpeza das principais praças da cidade', '2025-10-15 08:00:00', 'Praça Centenário', 50),
('Arrecadação de Alimentos', 'Coleta no campus do IFRS-BG', '2025-10-19 10:00:00', 'Campus IFRS-BG', 100);

-- Seed inicial de voluntários (senha: 123456 para todos)
INSERT INTO volunteers (name, email, phone, role, password) VALUES
('Administrador', 'admin@ifrs.edu', '(54) 99999-0001', 'admin', '123456'),
('João Pedro', 'user@ifrs.edu', '(54) 99999-0002', 'user', '123456'),
('Maria Franz', 'maria@ifrs.edu', '(54) 99999-0003', 'user', '123456'),
('Pedro Machado', 'pedro@ifrs.edu', '(54) 99999-0004', 'user', '123456');