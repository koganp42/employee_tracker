DROP DATABASE IF EXISTS emp_tracker_DB;
CREATE database emp_tracker_DB;

USE emp_tracker_DB;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
  department_id INT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE CASCADE
);

CREATE TABLE employee (
  id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE CASCADE
);
INSERT INTO department (name)
VALUES ("Sales"), ("Marketing"), ("Quality Assurance"), ("Legal"), ("Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 40000, 1), ("Engineer", 100000, 5), ("Director of Propaganda", 150000, 2), ("QA Specialist", 80000, 3), ("Counsel", 200000, 4), ("Sub-Director of Propaganda", 120000, 2), ("Secretary", 40000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Krewella", "Dancer", 1), ("Esteban", "James", 5), ("Efa", "Macias", 4), ("Sana", "Marquez", 3), ("Gurveer", "Burton", 5), ("Prista", "Ittel", 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Zohaib", "Hamilton", 2, 4), ("Terrance", "Wills", 8, 3);

SELECT * FROM department;
SELECT * FROM employee;
SELECT * FROM role;

UPDATE employee AS e SET e.manager_id = 4 WHERE e.id = 6

SELECT * FROM role WHERE title = "lasfjk";
UPDATE employee AS e SET e.role_id = 8 WHERE e.id = 9;

SELECT e.id AS 'Employee id', CONCAT(e.first_name, ' ', e.last_name) AS 'Manager Name', r.title AS 'Position', d.name AS 'Department', e.manager_id AS 'Manager id', CONCAT(m.first_name, m.last_name) AS 'Employees Managed'
	FROM employee AS e 
		LEFT JOIN role AS r ON e.role_id = r.id 
		LEFT JOIN department AS d ON r.department_id = d.id
        LEFT JOIN employee AS e1 ON e.id = e1.id
        INNER JOIN employee AS m ON e.id = m.manager_id
        WHERE e.id = 4;
        
        
SELECT e.id, CONCAT(e.first_name, e.last_name) AS 'Employee Name', r.title AS 'Position', d.name AS 'Department', e.manager_id AS "Manager's id"
	FROM employee AS e 
		LEFT JOIN role AS r ON e.role_id = r.id 
		LEFT JOIN department AS d ON r.department_id = d.id
        LEFT JOIN employee AS e1 ON e.id = e1.id
        INNER JOIN employee AS m ON e.id = m.manager_id;


