const mysql = require("mysql2");
const table = require("console.table");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Greenbatteriesonahorse584#',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );

  const questions = ["Select an option.",];

function select() {
    
    inquirer
    .prompt([
        {
            type: "list",
            name: "optionSelect",
            message: questions[0],
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'Add Department', 'Add Role', 'Add Employee', 'Exit',],
        },
    ])
    .then(function (data) {
        
        if (data.optionSelect === "View All Departments"){
            db.query("SELECT id, __name__ AS department FROM department", (err, results) => console.log(table.getTable(results)));
            // select();
        } else if (data.optionSelect === "View All Roles"){
            db.query(`SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
            FROM department
            JOIN __role__
            ON __role__.department_id = department.id;`, (err, results) => console.log(table.getTable(results)));
        } else if (data.optionSelect === "View All Employees"){
            db.query(`SELECT employee.id, employee.first_name, employee.last_name, __role__.title, department.__name__ AS department, __role__.salary, employee.manager_id AS manager  
            FROM department, __role__
            JOIN employee
            ON employee.role_id = __role__.id;`, (err, results) => console.log(table.getTable(results)));
        } else if (data.optionSelect === "Add Department"){
            
        } else if (data.optionSelect === "Add Role"){
            
        } else if (data.optionSelect === "Add Employee"){
            
        } else {
            return
        }

        // select();
    })
    // .then(select());
    
    
}



select();

    // inquirer file needed 
// inquirer questions will be list selection that does sql functions.
// view all departments = show * from departments table
// view all roles = show * from roles table
// view all employees = show * from employees table
// add a department/role/employee = insert into x table
// update an employee role = ...
// when adding x inquirer has to get person to input string

// bonus stuff is update employee managers:
// view employees by manager, this probably uses...
// view employees by department, this probably uses...
// delete departments etc should be simple
// view combined salaries of all employees in a department would use SUM()

// view all roles needs to join department name to the role table, remove department id
// view all employees needs to join both role name, salary and department name, no role id, no manager id, it needs to show manager name