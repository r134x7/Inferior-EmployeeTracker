INSERT INTO department (__name__)
VALUES ("Tech"),
        ("Human Resources"),
        ("Cows"),
        ("Dogs"),
        ("Hamster");

INSERT INTO __role__ (title, salary, department_id)
VALUES ("Manager", 88000, 1),
        ("Some Guy", 44000, 2),
        ("Some Gal", 44000, 3),
        ("Junior Detective", 37500, 4),
        ("Janitor", 29995, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Joe", "Blow", 1, NULL),
        ("Jack", "Sit", 2, 1),
        ("Jill", "Gill", 3, 1),
        ("Herlock", "Scholmes", 4, 3),
        ("Beep", "Boop", 5, 4);

