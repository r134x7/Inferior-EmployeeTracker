const mysql = require("mysql2");
const table = require("console.table");
const inquirer = require("inquirer");

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
  );



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