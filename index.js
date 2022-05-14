const mysql = require("mysql2");
const table = require("console.table");
const inquirer = require("inquirer");

const con = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Greenbatteriesonahorse584#',
        database: 'company_db'
    },
    console.log(`Connected to the company_db database.`)
    );
        
  const questions = ["Select an option.", "Name of department you want to add."];

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
            // await db.query("SELECT id, __name__ AS department FROM department")
            // db.query("SELECT id, __name__ AS department FROM department").then((err, results) => console.log(table.getTable(results))).then(select());
            // const main = await db.query("SELECT id, __name__ AS department FROM department")
            // console.log(table.getTable(main));
            // select(); 
            // con
            con.promise().query("SELECT id, __name__ AS department FROM department").then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
            // () => select();
            // select();
        } else if (data.optionSelect === "View All Roles"){
            // db.query(`SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
            // FROM department
            // JOIN __role__
            // ON __role__.department_id = department.id;`, (err, results) => console.log(table.getTable(results)));
            // con
            con.promise().query(`SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
             FROM department
             JOIN __role__
             ON __role__.department_id = department.id;`).then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        } else if (data.optionSelect === "View All Employees"){
            // db.query(`SELECT employee.id, employee.first_name, employee.last_name, __role__.title, department.__name__ AS department, __role__.salary, employee.manager_id AS manager  
            // FROM department, __role__
            // JOIN employee
            // ON employee.role_id = __role__.id;`, (err, results) => console.log(table.getTable(results)));
            con.promise().query(`SELECT employee.id, employee.first_name, employee.last_name, __role__.title, department.__name__ AS department, __role__.salary, employee.manager_id AS manager  
            FROM department, __role__
            JOIN employee
            ON employee.role_id = __role__.id;`).then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        } else if (data.optionSelect === "Add Department"){
            addDepartment();
        } else if (data.optionSelect === "Add Role"){
            
        } else if (data.optionSelect === "Add Employee"){
            
        } else {
            return
        }

        // select();
    })
    // .then(select());
    
    
}

function addDepartment() {

    inquirer
    .prompt([
        {
            type: "input",
            name: "addDepartment",
            message: questions[1],
        },
    ])
    .then(function (data) {
        db.query(`INSERT INTO department (__name__)
        VALUES (?);`, data, (err, results) => console.log(results));
    })
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