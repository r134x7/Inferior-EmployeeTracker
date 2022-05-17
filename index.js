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
  "Set salary for added role.", 
  "Assign role to which department?", 
  "What is the employee's first name?", 
  "What is the employee's last name?", 
  "Assign which role?", 
  "Assign which manager?",
  "Select an employee to update their role.",
  "Assign a new role.",
  "Select an employee to update their manager.",
  "Assign a new manager.",
  "Select a Manager.",
  "Select a Department.",
  "Delete a Department.",
  "Delete a Role.",
  "Delete an Employee.",
  ];

function select() {
    
    inquirer
    .prompt([
        {
            type: "list",
            name: "optionSelect",
            message: questions[0],
            choices: ['View All Departments', 'View All Roles', 'View All Employees', 'View Employees by Manager', 'View Employees by Department', 'View Department Budget', 'Add Department', 'Add Role', 'Add Employee', 'Update Employee Role', "Update Employee's Manager", 'Remove a Department', 'Remove a Role', 'Terminate an Inferior Employee','Exit',],
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
        } else if (data.optionSelect === "View Department Budget"){
            viewDepartmentBudget();
        } else if (data.optionSelect === "Remove a Department"){
            removeDepartment();
        } else if (data.optionSelect === "Remove a Role"){
            removeRole();
        } else if (data.optionSelect === "Terminate an Inferior Employee"){
            removeEmployee();
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

con.query(`SELECT id, __name__ AS department FROM department`, 
function (err, results) {
    const x = results.map(({department}) => department) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array

    const y = results.map (({id}) => id)

    return questionRole(x, y);
});    

function questionRole(departments, id) {
    
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

        data.assignDepartment = departments.indexOf(data.assignDepartment) // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        id = id[data.assignDepartment] 

        con.promise().query(`INSERT INTO __role__ (title, salary, department_id) VALUES (?, ?, ?);`, [data.addRole, data.addSalary, id])
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
  }
}

function addEmployee() {

    con.query(`SELECT id, __role__.title FROM __role__;`, 
        function (err, results) {
        const x = results.map(({title}) => title) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
                
        const y = results.map (({id}) => id)


    return getManagers(x, y);
    });

    function getManagers(x, y) {

        con.query(`SELECT id, first_name, last_name FROM employee;`, 
            function (err, results) {
            const z = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
            
            z.push("No one")
            
            const employee_id = results.map (({id}) => id)
            
        return questionEmployee(x, y, z, employee_id);
        })

function questionEmployee(title, id, manager_name, employee_id) {

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
        
        data.assignRole = title.indexOf(data.assignRole)// returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
        id = id[data.assignRole]

        if (data.assignManager !== "No one") {
            data.assignManager = manager_name.indexOf(data.assignManager) // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
            employee_id = employee_id[data.assignManager]
        } else {
            data.assignManager = null; // it's funny that null needed to be spelled lowercase for it to work.
        }

        con.promise().query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`, [data.firstName, data.lastName, id, employee_id])
        .catch(console.log())
        .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })

  }
 }
}

function updateEmployeeRole() {

    con.query(`SELECT id, first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        const x = results.map (({id}) => id)

    return getRoles(y, x);
    })

    function getRoles(employees, employee_id) {
        
        con.query(`SELECT id, __role__.title FROM __role__;`, 
            function (err, results) {
            const x = results.map(({title}) => title) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array       
                
            // could not use previous method of search role and employee name at same time as added employees also duplicated roles since it was listing by id.

            const y = results.map (({id}) => id)
            

        return updateRoleQuestions(employees, employee_id, x, y);
        });
    }
    
    function updateRoleQuestions(employees, employee_id, title, title_id) {
        
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

            data.assignRole = title.indexOf(data.assignRole) // returns the integer of the array index and add it by 1 to match the department_id correctly. source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf
            title_id = title_id[data.assignRole]


            data.selectEmployee = employees.indexOf(data.selectEmployee)
            employee_id = employee_id[data.selectEmployee]
    
            con.promise().query(`UPDATE employee
            SET role_id = ?
            WHERE employee.id = ?;`, [title_id, employee_id])
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
    // 'is null' is used and not '= null' because of how mysql logic operators work...
    con.query(`SELECT 
    employee.id,
    employee.first_name, 
    employee.last_name 
    FROM employee
    WHERE manager_id is null;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array
        
        console.log(y);

        const x = results.map (({id}) => id)

        console.log(x);

    return questionEmployeeManagers(y, x);
    })

    function questionEmployeeManagers(managerName, managerId) {
        
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

        data.selectManager = managerName.indexOf(data.selectManager)
        managerId = managerId[data.selectManager]

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
        WHERE manager_id = ?;`, managerId).then(
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

function viewDepartmentBudget() {

    con.query(`SELECT __name__ AS department FROM department`, 
    function (err, results) {
        const x = results.map(({department}) => department) // using functional/declarative programming i.e. map. To destructure the objects in the array to put only the values from the key-value pairs in an array, source: https://stackoverflow.com/questions/19590865/from-an-array-of-objects-extract-value-of-a-property-as-array
    
        return questionDepartmentBudget(x);
    });    

function questionDepartmentBudget(department) {
    
        inquirer
        .prompt([
            {
                type: "list",
                name: "viewBudget",
                message: questions[14],
                choices: department
            },
        ])
        .then (function (data) {
        
            data.viewBudget = department.indexOf(data.viewBudget) + 1
        
            con.promise().query(`SELECT 
            COUNT(employee.id) AS employee_headcount, 
            SUM(__role__.salary) AS department_budget
            FROM employee
            JOIN __role__
            ON employee.role_id = __role__.id
            JOIN department
            ON __role__.department_id = department.id
            WHERE department.id = ?;`, data.viewBudget).then(
                ([results]) => console.log(table.getTable(results)))
                .catch(console.log())
                .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.    
        })
    }
}

function removeDepartment() {
    con.query(`SELECT department.id, department.__name__ AS department
    FROM department;`, 
        function (err, results) {
        const y = results.map (({department}) => department)

        const x = results.map (({id}) => id)

        return questionRemoveDepartment(y, x)
    })

    function questionRemoveDepartment(department, id) {
        
    inquirer
        .prompt([
            {
                type: "list",
                name: "removeDepartment",
                message: questions[15],
                choices: department
            },
        ])
    .then(function (data) {

        data.removeDepartment = department.indexOf(data.removeDepartment)
        id = id[data.removeDepartment]

        // data.removeDepartment = department.indexOf(data.removeDepartment) + 1

        con.promise().query(`DELETE 
        FROM department
        WHERE department.id = ?;`, id)
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
    }
}

function removeRole() {
    con.query(`SELECT __role__.id, __role__.title
    FROM __role__;`, 
        function (err, results) {
        const y = results.map (({title}) => title)

        const x = results.map (({id}) => id)

        return questionRemoveRole(y, x)
    })

    function questionRemoveRole(title, id) {
        
    inquirer
        .prompt([
            {
                type: "list",
                name: "removeRole",
                message: questions[16],
                choices: title
            },
        ])
    .then(function (data) {

        data.removeRole = title.indexOf(data.removeRole)
        id = id[data.removeRole]

        con.promise().query(`DELETE 
        FROM __role__
        WHERE __role__.id = ?;`, id)
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
  }
}

function removeEmployee() {
    con.query(`SELECT id, first_name, last_name FROM employee;`, 
        function (err, results) {
        const y = results.map (({first_name, last_name}) => first_name + " " + last_name) // destructuring objects using map and then concatenating the values to make a full name array

        const x = results.map (({id}) => id)

        return questionRemoveEmployee(y, x)
    })

    function questionRemoveEmployee(name, id) {
        
    inquirer
        .prompt([
            {
                type: "list",
                name: "removeEmployee",
                message: questions[17],
                choices: name
            },
        ])
    .then(function (data) {

        data.removeEmployee = name.indexOf(data.removeEmployee)
        id = id[data.removeEmployee]

        con.promise().query(`DELETE 
        FROM employee
        WHERE employee.id = ?;`, id)
            .catch(console.log())
            .then(() => select()); // using con.end like in the documentation causes the connection to close which makes a mess.
    })
  } 
}

select();
