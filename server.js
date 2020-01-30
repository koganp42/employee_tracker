const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
const { port, password, databaseName } = require("./config");
const validatePrompt = require("./validatePrompt");

const connection = mysql.createConnection({
  host: "localhost",

  port: port,

  user: "root",

  password: password,
  database: databaseName
});
//left, inner, inner join for getting the employees and all relevant information
//Select e.id, e.name, m.id, m.name FROM employee as e LEFT JOIN employee on e.manager=m.id
connection.connect(function (err) {
  if (err) throw err;
  console.log(`Your port is ${process.env.PORT}`);
  startPrompts();
});

function startPrompts() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "Add a new department",
        "Add a new role",
        "Add a new employee",
        "View all departments",
        "View all roles",
        "View all employees",
        "View all managers",
        "View employees by manager",
        "Update an employee's role",
        "Update an employee's manager",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {

        case "View all departments":
          viewDepartments();
          break;

        case "View all roles":
          viewRoles();
          break;

        case "View all employees":
          viewEmployees();
          break;

        case "View all managers":
          viewManagers();
          break;

        case "View employees by manager":
          viewEmployeesByManager();
          break;

        case "Add a new department":
          addNewDepartment();
          break;

        case "Add a new role":
          addNewRole();
          break;

        case "Add a new employee":
          addNewEmployee();
          break;

        case "Update an employee's role":
          updateEmployeeRole();
          break;

        case "Update an employee's manager":
          updateEmployeeManager();
          break;

        case "Exit":
          connection.close(function (err) {
            if (err) {
              console.log('Error closing connection', err);
            } else {
              console.log('Connection closed');
            }
          });
      }
    });
}

//The following three functions query the mysql database for the specific table data being requested.
function viewDepartments() {
  let query = "SELECT * FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

function viewRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

function viewEmployees() {
  let query = `SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS "Employee Name", r.title AS "Position", d.name AS "Department", e.manager_id AS "Manager's id"
                FROM employee AS e 
                  LEFT JOIN role AS r ON e.role_id = r.id 
                  LEFT JOIN department AS d ON r.department_id = d.id`;
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

function viewEmployeesByManager() {
  inquirer
    .prompt([
      {
        name: "selectManager",
        type: "number",
        message: "What is the id of the manager you wish to view?"
      },
    ])
    .then(function (answer) {
      connection.query(`SELECT e.id AS 'Manager id', CONCAT(e.first_name, ' ', e.last_name) AS 'Manager', r.title AS 'Position', d.name AS 'Department', CONCAT(m.first_name, m.last_name) AS 'Employees Managed:'
            FROM employee AS e 
              LEFT JOIN role AS r ON e.role_id = r.id 
              LEFT JOIN department AS d ON r.department_id = d.id
              LEFT JOIN employee AS m ON e.id = m.manager_id
              WHERE e.id = ?`, answer.selectManager, function (err, res) {
          if (err) throw err;
          console.table(res);
          startPrompts();
        });
    });

}

// function viewManagers() {
//   let query = "SELECT * FROM employee";
//   connection.query(query, function (err, res) {
//     if (err) throw err;
//     console.table(res);
//     startPrompts();
//   });
// }

// The inquirer function called when a new department is being added.
function addNewDepartment() {
  inquirer
    .prompt({
      name: "newDepartmentName",
      type: "input",
      message: "What is the name of the new department?",
      validate: validatePrompt.validateRequiredTextInput
    })
    .then(function (answer) {
      let regularAnswer = answer.newDepartmentName;
      let lowerCaseAnswer = regularAnswer.toLowerCase();
      connection.query("SELECT LOWER(name) AS nameL FROM department", function (err, res) {
        if (err) throw err;
        //The validation below currently doesn't work
        res.forEach(nameL => {
          if (lowerCaseAnswer === nameL) {
            console.log("")
            return new Error("Sorry, that department already exists!");
          }
        });
        connection.query(
          "INSERT INTO department SET ?",
          {
            name: regularAnswer,
          },
          function (err) {
            if (err) throw err;
            console.log("The new department was added succesfully!");
            startPrompts();
          }
        );
      });
    });

}

// The inquirer function called when a new role is being added.
function addNewRole() {
  let departmentChoices = [];
  connection.query("SELECT name, id FROM department", function (err, res) {
    if (err) throw err;
    res.forEach(department => {
      departmentChoices.push(department);
    })
    console.table(res);
    inquirer
      .prompt([
        {
          name: "newRoleDepartment",
          type: "number",
          message: "What is the id of the department the new role will belong to?",
          // Might try to come back and make the rawlist method work instead, but for now going with a simple input.
          //type: "rawlist",
          //message: "Which department does the new role belong to?",
          //choices: departmentChoices
        },
        {
          name: "newRoleTitle",
          type: "input",
          message: "What is the title of the new role?",
          validate: (answer) => {
            if (typeof answer === "string" && answer.length > 1) {
              return true;
            }
            return false;
          }
        },
        {
          name: "newRoleSalary",
          type: "number",
          message: "What is the salary for the new role?",
          // validate: function(answer) {
          //   if (typeof answer === "number") {
          //     return true;
          //   } else {
          //     return false
          //   };
          // }
        }
      ])
      .then(function (answer) {
        // connection.query("SELECT * FROM role LEFT JOIN department ON role.department WHERE title = ? AND ", function(err, res) {
        //   if (err){
        connection.query(
          "INSERT INTO role SET ?",
          {
            title: answer.newRoleTitle,
            salary: answer.newRoleSalary,
            department_id: answer.newRoleDepartment || 0
          },
          function (err) {
            if (err) throw err;
            console.log("The new role was added succesfully!");
            startPrompts();
          }
        );
        // } else {
        //   return
        // }
        //});
        // The below checks to see whether there's already a role of the same name in the given department, preventing duplicates from being added. I'd like to learn enough of regex to make the check more complete by making the check case insensitive. Also, this may need to be moved to another part of the inquirer prompt as I'll need to check
        // validate: function(answer) {
        //   let query = "SELECT * FROM role";
        //   connection.query(query, function(err, res) {
        //     if (err) throw err;
        //     res.forEach(role => {
        //       if (answer === role.name) {
        //         return true;
        //       }
        //       return false;
        //     });

        //   });
        // }
      });
  });
}

// The inquirer function called when a new role is being added.
function addNewEmployee() {
  inquirer
    .prompt([
      {
        name: "newEmployeeFirstName",
        type: "input",
        message: "What is the employee's first name?",
        validate: (answer) => {
          if (typeof answer === "string" && answer !== null) {
            return true;
          }
          return false;
        }
      },
      {
        name: "newEmployeeLastName",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "newEmployeeRole",
        type: "number",
        message: "What is the id number of the employee's new role?",
        validate: (answer) => {
          if (typeof answer === "number") {
            return true;
          }
          return false;
        }
      },
      {
        name: "newEmployeeManagerConfirm",
        type: "confirm",
        message: "Does the new employee have a manager?",
      },
      {
        name: "newEmployeeManager",
        type: "number",
        message: "What is the id number of the employee's new manager?",
        when: function (answer) {
          return answer.newEmployeeManagerConfirm === true;
        }
      }
    ])
    .then(function (answer) {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: answer.newEmployeeFirstName,
          last_name: answer.newEmployeeLastName,
          role_id: answer.newEmployeeRole || 0,
          manager_id: answer.newEmployeeManager || null
        },
        function (err) {
          if (err) throw err;
          console.log("The new employee was added succesfully!");
          startPrompts();
        }
      );
    });
}

function updateEmployeeRole() {
  inquirer
    .prompt([
      {
        name: "selectEmployee",
        type: "number",
        message: "What is the id of the employee whose role you want to edit?"
      },
      {
        name: "selectNewRole",
        type: "number",
        message: "What is the id of the employee's new role?"
      }
    ])
    .then(function (answer) {
      connection.query("UPDATE employee AS e SET e.role_id = ? WHERE e.id = ?", [answer.selectNewRole, answer.selectEmployee], function (err, res) {
        if (err) throw err;
        console.log("The employee's role was changed succesfully!");
        startPrompts();
      });
    });

}

function updateEmployeeManager() {
  inquirer
    .prompt([
      {
        name: "selectEmployee",
        type: "number",
        message: "What is the id of the employee whose manager is changing?"
      },
      {
        name: "selectNewManager",
        type: "number",
        message: "What is the id of the employee's new manager?"
      }
    ])
    .then(function (answer) {
      connection.query("UPDATE employee AS e SET e.manager_id = ? WHERE e.id = ?", [answer.selectNewManager, answer.selectEmployee], function (err, res) {
        if (err) throw err;
        console.log("The employee's manager was changed succesfully!");
        startPrompts();
      });
    });

}

function viewManagers() {

  connection.query(`SELECT e.id AS 'Employee id', CONCAT(e.first_name, ' ', e.last_name) AS 'Manager', r.title AS 'Position', d.name AS 'Department', CONCAT(m.first_name, m.last_name) AS 'Employees Managed:'
                FROM employee AS e 
                  LEFT JOIN role AS r ON e.role_id = r.id 
                  LEFT JOIN department AS d ON r.department_id = d.id
                  LEFT JOIN employee AS m ON e.id = m.manager_id`,
    function (err, res) {
      if (err) throw err;
      console.table(res);
      startPrompts();
    });
};
    
      




// If you need to delete a department or role, or an employee who manages another, you'll need to casade the delete