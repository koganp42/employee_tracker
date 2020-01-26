DROP DATABASE IF EXISTS emp_tracker_DB;
CREATE database emp_tracker_DB;

USE emp_tracker_DB;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);
INSERT INTO department (name)
VALUES ("Sales"), ("Marketing"), ("Quality Assurance"), ("Legal"), ("Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 40000, 1), ("Engineer", 100000, 5), ("Director of Propaganda", 150000, 2), ("QA Specialist", 80000, 3), ("Counsel", 200000, 4), ("Sub-Director of Propaganda", 120000, 2);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Krewella", "Dancer", 1), ("Esteban", "James", 5), ("Efa", "Macias", 4), ("Sana", "Marquez", 3), ("Gurveer", "Burton", 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Zohaib", "Hamilton", 2, 4);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;