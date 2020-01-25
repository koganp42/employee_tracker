DROP DATABASE IF EXISTS employee_mgmt_DB;
CREATE database employee_mgmt_DB;

USE employee_mgmt_DB;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT FOREIGN KEY REFERENCES role(id),
  manager_id INT NULL FOREIGN KEY REFERENCES employee(id)
);

CREATE TABLE role (
  id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NULL FOREIGN KEY REFERENCES department(id)
);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;