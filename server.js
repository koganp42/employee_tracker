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
connection.connect(function(err) {
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
        "Update an employee's role",
        "Exit"
      ]
    })
    .then(function(answer) {
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

      case "Exit":
        connection.close(function(err) {
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
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

function viewRoles() {
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

function viewEmployees() {
  let query = "SELECT * FROM employee";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompts();
  });
}

// The inquirer function called when a new department is being added.
function addNewDepartment() {
    inquirer
      .prompt({
        name: "newDepartmentName",
        type: "input",
        message: "What is the name of the new department?",
        validate: validatePrompt.validateRequiredTextInput
      })
      .then(function(answer) {
        let regularAnswer = answer.newDepartmentName;
        let lowerCaseAnswer = regularAnswer.toLowerCase();
        connection.query("SELECT LOWER(name) AS nameL FROM department", function(err, res) {
          if (err) throw err;
          res.forEach(nameL => {
            if (lowerCaseAnswer === nameL) {
              return new Error ("Sorry, that department already exists!");
            }
          });
          connection.query(
            "INSERT INTO department SET ?",
            {
              name: regularAnswer,
            },
            function(err) {
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
  connection.query("SELECT name FROM department", function(err, res) {
    if (err) throw err;
    res.forEach(departmentName => {
      departmentChoices.push(departmentName);
    })
  inquirer
    .prompt([
      {
        name: "newRoleDepartment",
        type: "rawlist",
        message: "Which department does the new role belong to?",
        choices: departmentChoices
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
        type: "input",
        message: "What is the salary for the new role?",
        validate: function(answer) {
          if (typeof answer === "number") {
            return true;
          } else {
            return false
          };
        }
      }
  ])
    .then(function(answer) {
      connection.query("SELECT LOWER(name FROM department", function(err, res) {
        res.forEach(role => {
          if (answer.newRoleTitle === role.name) {
            return true;
          }
          return false;
        });
      });
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.newRoleTitle,
          salary: answer.newRoleSalary, 
          department_id: answer.newRoleDepartment || 0
        },
        function(err) {
          if (err) throw err;
          console.log("The new department was added succesfully!");
          startPrompts();
        }
      );
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
        message: "What is the employee's first name?",
        validate: function(answer) {
          if (typeof answer === "number") {
            return true;
          } else {
            return false
          };
        }
      },
      {
        name: "newEmployeeRole",
        type: "input",
        message: "What is the id number of the department the new role belongs to?",
        validate: (answer) => {
          if (typeof answer === "number") {
            return true;
          }
          return false;
        }
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
      }
  ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role SET ?",
        {
          title: answer.newRoleTitle,
          salary: answer.newRoleSalary, 
          department_id: answer.newRoleDepartment || 0
        },
        function(err) {
          if (err) throw err;
          console.log("The new department was added succesfully!");
          startPrompts();
        }
      );
    });
}




// If you need to delete a department or role, or an employee who manages another, you'll need to casace the delete