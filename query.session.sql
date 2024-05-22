CREATE TABLE IF NOT EXISTS portal(
    portal_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    password VARCHAR(255) 
);


CREATE TABLE IF NOT EXISTS urole(
    urole_id INT PRIMARY KEY AUTO_INCREMENT,
    portal_id INT,
    role VARCHAR(128),
    FOREIGN KEY (portal_id) REFERENCES portal(portal_id)
);

CREATE TABLE IF NOT EXISTS account(
    account_id INT PRIMARY KEY AUTO_INCREMENT,
    portal_id INT,
    firstname VARCHAR(128),
    lastname VARCHAR(128),
    address VARCHAR(255),
    contact VARCHAR(11),
    image VARCHAR(255),
    FOREIGN KEY (portal_id) REFERENCES portal(portal_id)
);

CREATE TABLE IF NOT EXISTS schedule(
    schedule_id INT PRIMARY KEY AUTO_INCREMENT,
    time_s TIME,
    time_e TIME
);

CREATE TABLE IF NOT EXISTS appointment(
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    portal_id INT,
    schedule_id INT,
    date DATE,
    firstname VARCHAR(128),
    lastname VARCHAR(128),
    childname VARCHAR(128),
    contact VARCHAR(11),
    FOREIGN KEY (portal_id) REFERENCES portal(portal_id),
    FOREIGN KEY (schedule_id) REFERENCES schedule(schedule_id)
);

CREATE TABLE IF NOT EXISTS prescription(
    prescription_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    portal_id INT,
    message VARCHAR(9999),
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id),
    FOREIGN KEY (portal_id) REFERENCES portal(portal_id)
);

CREATE TABLE IF NOT EXISTS cancel(
    cancel_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    FOREIGN KEY (appointment_id) REFERENCES appointment(appointment_id)
);

ALTER TABLE portal AUTO_INCREMENT = 100;
ALTER TABLE urole AUTO_INCREMENT = 10;
ALTER TABLE account AUTO_INCREMENT = 10;
ALTER TABLE appointment AUTO_INCREMENT = 10;
ALTER TABLE schedule AUTO_INCREMENT = 10;

