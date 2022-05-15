SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
FROM department
JOIN __role__
ON __role__.department_id = department.id;

SELECT __role__.title
FROM __role__;

SELECT first_name, last_name
FROM employee;

-- SELECT employee.id, employee.first_name, employee.last_name, __role__.title, department.__name__ AS department, __role__.salary, employee.manager_id AS manager  
-- FROM department, __role__
-- JOIN employee
-- ON employee.role_id = __role__.id;