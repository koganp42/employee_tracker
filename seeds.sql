INSERT INTO department (name)
VALUES ("Sales"), ("Marketing"), ("Quality Assurance"), ("Legal"), ("Development");

INSERT INTO role (title, salary, department_id)
VALUES ("Salesperson", 40000, 1), ("Engineer", 100000, 5), ("Director of Propaganda", 150000, 2), ("QA Specialist", 80000, 3), ("Counsel", 200000, 4), ("Sub-Director of Propaganda", 120000, 2), ("Secretary", 40000, 4);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Krewella", "Dancer", 1), ("Esteban", "James", 5), ("Efa", "Macias", 4), ("Sana", "Marquez", 3), ("Gurveer", "Burton", 5), ("Prista", "Ittel", 7), ("Johnny", "Walker", 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Zohaib", "Hamilton", 2, 4), ("Terrance", "Wills", 7, 3);

