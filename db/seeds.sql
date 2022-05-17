INSERT INTO department (__name__)
VALUES ("Engineering"),
        ("Human Resources"),
        ("Finance"),
        ("Forensics"),
        ("Cleaning");

INSERT INTO __role__ (title, salary, department_id)
VALUES ("Senior Engineer", 90000, 1),
       ("Junior Engineer", 45000, 1),
        ("HR Manager", 60000, 2),
        ("HR Assistant", 35000, 2),
        ("Finance Gal", 70000, 3),
        ("Finance Guy", 70000, 3),
        ("Senior Detective", 55000, 4),
        ("Junior Detective", 32000, 4),
        ("Robot Butler", 40000, 5),
        ("Robot Maid", 40000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Engine", 1, NULL),
        ("Jane", "Computer", 2, 1),
        ("Joe", "Blow", 3, NULL),
        ("Jill", "Gill", 4, 3),
        ("Sarah", "Sara", 5, NULL),
        ("Phil", "Bill", 6, 5),
        ("Guy", "Watson", 7, NULL),
        ("Herlock", "Scholmes", 8, 7),
        ("Beep", "Boop", 9, NULL),
        ("Meep", "Meep", 10, 9);