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
    console.log(`
    ------------
    | INFERIOR |
    | EMPLOYEE |
    | TRACKER  |
    ------------
    `)
    );
        
  const questions = ["Select an option.", 
  "Name of department you want to add.", 
  "Name of role you want to add.", 
  "Set salary for added role", 
  "Assign role to which department?", 
  "What is the employee's first name?", 
  "What is the employee's last name?", 
  "Assign which role?", 
  "Assign which manager?"];

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
            addRole();
        } else if (data.optionSelect === "Add Employee"){
            addEmployee();
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
        // db.query(`INSERT INTO department (__name__)
        // VALUES (?);`, data, (err, results) => console.log(results));
        con.promise().query(`INSERT INTO department (__name__)
            VALUES (?);`, data.addDepartment)
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
}

function addRole() {

con.query(`SELECT __name__ AS department FROM department`, 
function (err, results) {
    const x = results.map(({department}) => department) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array

    return questionRole(x);
});    

function questionRole(departments) {
    
    inquirer
    .prompt([
        {
            type: "input",
            name: "addRole",
            message: questions[2],
        },
        {
            type: "input",
            name: "addSalary",
            message: questions[3],
        },
        {
            type: "list",
            name: "assignDepartment",
            message: questions[4],
            choices: departments 
        },
    ])
    .then(function (data) {
        // db.query(`INSERT INTO department (__name__)
        // VALUES (?);`, data, (err, results) => console.log(results));
        // console.log(departments);
        // if (data.assignDepartment === departments[2]) {
        //     data.assignDepartment = 3;
        //     data.addSalary = Number(data.addSalary)
        // }
        // console.log(data.addSalary);
        // console.log(data.assignDepartment);
        console.log(data.assignDepartment);
        data.assignDepartment = departments.indexOf(data.assignDepartment) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        console.log(data.assignDepartment);
        con.promise().query(`INSERT INTO __role__ (title, salary, department_id) VALUES (?, ?, ?);`, [data.addRole, data.addSalary, data.assignDepartment])
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
  }
}

function addEmployee() {

    con.query(`SELECT __role__.title FROM __role__;`, 
        function (err, results) {
        const x = results.map(({title}) => title) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
            console.log(x);        
            // could not use previous method of search role and employee name at same time as added employees also duplicated roles since it was listing by id.
    return getManagers(x);
    });

    function getManagers(x) {

        con.query(`SELECT first_name, last_name FROM employee;`, 
            function (err, results) {
            const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
            console.log(y);
            
            y.push("No one")        

        return questionEmployee(x, y);
        })

function questionEmployee(title, manager_name) {

    inquirer
    .prompt([
        {
            type: "input",
            name: "firstName",
            message: questions[5],
        },
        {
            type: "input",
            name: "lastName",
            message: questions[6],
        },
        {
            type: "list",
            name: "assignRole",
            message: questions[7],
            choices: title 
        },
        {
            type: "list",
            name: "assignManager",
            message: questions[8],
            choices: manager_name // have to figure out how to get the managers...
        },
    ])
    .then(function (data) {
        console.log(data.assignRole);
        console.log(data.assignManager);
        data.assignRole = title.indexOf(data.assignRole) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        if (data.assignManager !== "No one") {
            data.assignManager = manager_name.indexOf(data.assignManager) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        } else {
            data.assignManager = null; // it's funny that null needed to be spelled lowercase for it to work.
        }
        console.log(data.assignRole);
        console.log(data.assignManager);

        con.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [data.firstName, data.lastName, data.assignRole, data.assignManager])
        .catch(console.log())
        .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })

}
}
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