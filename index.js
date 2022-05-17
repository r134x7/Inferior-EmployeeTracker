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
  "Assign which manager?",
  "Select an employee to update their role.",
  "Assign a new role.",
  "Select an employee to update their manager",
  "Assign a new manager",
  "Select a Manager",
  "Select a Department",
  ];

function select() {
    
    inquirer
    .prompt([
        {
            type: "list",
            name: "optionSelect",
            message: questions[0],
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', "Update Employee's Manager",'Exit',],
        },
    ])
    .then(function (data) {
        
        if (data.optionSelect === "View All Departments"){
            con.promise().query("SELECT id, __name__ AS department FROM department").then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        } else if (data.optionSelect === "View All Roles"){
            con.promise().query(`SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
             FROM department
             JOIN __role__
             ON __role__.department_id = department.id;`).then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        } else if (data.optionSelect === "View All Employees"){
            con.promise().query(`SELECT 
            employee.id, 
            employee.first_name, 
            employee.last_name, 
            __role__.title, 
            department.__name__ AS department, 
            __role__.salary, 
            employee.manager_id AS manager  
            FROM employee
            JOIN __role__
            ON employee.role_id = __role__.id
            JOIN department
            ON __role__.department_id = department.id;`).then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        } else if (data.optionSelect === "View Employees by Manager"){
            viewEmployeeManagers();
        } else if (data.optionSelect === "View Employees by Department"){
            viewEmployeeDepartments();
        } else if (data.optionSelect === "Add Department"){
            addDepartment();
        } else if (data.optionSelect === "Add Role"){
            addRole();
        } else if (data.optionSelect === "Add Employee"){
            addEmployee();
        } else if (data.optionSelect === "Update Employee Role"){
            updateEmployeeRole();
        } else if (data.optionSelect === "Update Employee's Manager"){
            updateEmployeeManager();
        } else {
            return
        }
    })
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
            choices: manager_name
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

function updateEmployeeRole() {

    con.query(`SELECT first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        console.log(y);

    return getRoles(y);
    })

    function getRoles(employees) {
        
        con.query(`SELECT __role__.title FROM __role__;`, 
            function (err, results) {
            const x = results.map(({title}) => title) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
                console.log(x);        
                // could not use previous method of search role and employee name at same time as added employees also duplicated roles since it was listing by id.

        return updateRoleQuestions(employees, x);
        });
    }
    
    function updateRoleQuestions(employees, title) {
        
        inquirer
        .prompt([
            {
                type: "list",
                name: "selectEmployee",
                message: questions[9],
                choices: employees 
            },
            {
                type: "list",
                name: "assignRole",
                message: questions[10],
                choices: title
            },
        ])
        .then(function (data) {
            console.log(data.assignRole);
            console.log(data.selectEmployee);
            data.assignRole = title.indexOf(data.assignRole) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

            data.selectEmployee = employees.indexOf(data.selectEmployee) + 1
            
            console.log(data.assignRole);
            console.log(data.selectEmployee);
    
            con.promise().query(`UPDATE employee
            SET role_id = ?
            WHERE employee.id = ?;`, [data.assignRole, data.selectEmployee])
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        })
    } 

}

function updateEmployeeManager() {

    con.query(`SELECT first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        console.log(y);

    return assignDifferentManager(y);
    })

    function assignDifferentManager(employee) {
        
        con.query(`SELECT first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        console.log(y);
        
        y.push("No one")        

        return updateEmployeeManagerQuestions(employee, y);
        });
    }
    
    function updateEmployeeManagerQuestions(employees, manager) {
        
        inquirer
        .prompt([
            {
                type: "list",
                name: "selectEmployee",
                message: questions[11],
                choices: employees 
            },
            {
                type: "list",
                name: "assignManager",
                message: questions[12],
                choices: manager
            },
        ])
        .then(function (data) {
            console.log(data.selectEmployee);
            console.log(data.assignManager);
            data.selectEmployee = employees.indexOf(data.selectEmployee) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf

            if (data.assignManager !== "No one") {
                data.assignManager = manager.indexOf(data.assignManager) + 1 // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
            } else {
                data.assignManager = null; // it's funny that null needed to be spelled lowercase for it to work.
            }
            
            console.log(data.selectEmployee);
            console.log(data.assignManager);
    
            con.promise().query(`UPDATE employee
            SET manager_id = ?
            WHERE employee.id = ?;`, [data.assignManager, data.selectEmployee])
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
        })
    } 

}

function viewEmployeeManagers() {

    con.query(`SELECT first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        console.log(y);

    return questionEmployeeManagers(y);
    })

    function questionEmployeeManagers(managerName) {
        
    inquirer
    .prompt([
        {
            type: "list",
            name: "selectManager",
            message: questions[13],
            choices: managerName
        },
    ])
    .then (function (data) {

        data.selectManager = managerName.indexOf(data.selectManager) + 1

        con.promise().query(`SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        __role__.title, 
        department.__name__ AS department, 
        __role__.salary, 
        employee.manager_id AS manager  
        FROM employee
        JOIN __role__
        ON employee.role_id = __role__.id
        JOIN department
        ON __role__.department_id = department.id
        WHERE manager_id = ?;`, data.selectManager).then(
            ([results]) => console.log(table.getTable(results)))
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.    
    })
  }
}

function viewEmployeeDepartments() {

        con.query(`SELECT __name__ AS department FROM department`, 
        function (err, results) {
            const x = results.map(({department}) => department) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
        
            return questionEmployeeDepartments(x);
        });    

    function questionEmployeeDepartments(department) {
        
    inquirer
    .prompt([
        {
            type: "list",
            name: "selectDepartment",
            message: questions[14],
            choices: department
        },
    ])
    .then (function (data) {

        data.selectDepartment = department.indexOf(data.selectDepartment) + 1

        con.promise().query(`SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        __role__.title, 
        department.__name__ AS department, 
        __role__.salary, 
        employee.manager_id AS manager  
        FROM employee
        JOIN __role__
        ON employee.role_id = __role__.id
        JOIN department
        ON __role__.department_id = department.id
        WHERE department.id = ?;`, data.selectDepartment).then(
            ([results]) => console.log(table.getTable(results)))
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.    
    })
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
// view employees by manager, this probably uses... select a manager, then it list the employees under that manager
// view employees by department, this probably uses... select a department, then it lists the employees under that department
// delete departments etc should be simple... delete a department, delete a role, delete an employee...
// view combined salaries of all employees in a department would use SUM()

// view all roles needs to join department name to the role table, remove department id
// view all employees needs to join both role name, salary and department name, no role id, no manager id, it needs to show manager name