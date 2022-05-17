-- SELECT __role__.id, __role__.title, department.__name__ AS department, __role__.salary  
-- FROM department
-- JOIN __role__
-- ON __role__.department_id = department.id;

-- SELECT __role__.title
-- FROM __role__;

-- SELECT first_name, last_name
-- FROM employee;

SELECT 
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
WHERE department.id = 1;
-- Reminder, main table used starts at FROM and then join other tables to main using JOIN, when joining multiple tables use JOIN and ON for each table used

SELECT 
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
WHERE manager_id = 1;
