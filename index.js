const inquirer = require('inquirer');
const db = require('./db/connection');

    // Extras
        //Update employee managers
        //View employees by manager
        //View employees by department
        //Delete departments, roles, and employees
        //View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
// create functions to,
    //prompt user with questions


    //query the DB with queries created earlier
    //use console.table to display data in the console

    
    

const initPrompt = () => {
    return inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: "What would you like to do?",
            choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Update employee manager', 'View employees by manager', 'View employees by department', 'Delete departments, roles, and employees', 'View the total utilized budget of a department', 'Quit']
        }
    ]).then(answer => {
        switch(answer.action) {
            case 'View all departments':
                getAllDepartments();
                break;
            case 'View all roles':
                getAllRoles();
                break;
            case 'View all employees':
                getAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                addEmployee();
                break;
            case 'Update employee manager':
                console.log('Coming soon!');
                break;
            case 'View employees by manager':
                console.log('Coming soon!');
                break;
            case 'View employees by department':
                console.log('Coming soon!');
                break;
            case 'Delete departments, roles, and employees':
                console.log('Coming soon!');
                break;
            case 'View the total utilized budget of a department':
                console.log('Coming soon!');
                break;
            case 'Quit':
                console.log('See you soon, bye!');
                break;
        }        
    })
}

initPrompt();



function getAllDepartments() {
    const sql = `SELECT id, dep_name AS name FROM department`;    
    DBCall_getAllDepartments(sql);

    async function DBCall_getAllDepartments(sql){
        try {
            const results = await db.query(sql);
            if(results) {                
                // console.log("+++ Database returned results: \n", results[0]);
                console.table(results[0]);
                initPrompt();
            }
        
        } catch (error){
            console.error ("xxx Database returned an error: \n", error)
        }
    }    
};

function getAllRoles() {
    const sql = `SELECT roles.id, roles.title, department.dep_name AS department, roles.salary
                FROM roles
                LEFT JOIN department ON roles.department_id = department.id`;
    DBCall_getAllRoles(sql);

    async function DBCall_getAllRoles(sql) {
        try {
            const results = await db.query(sql);
            if(results) {                
                // console.log("+++ Database returned results: \n", results[0]);
                console.table(results[0]);
                initPrompt();
            }
        
        } catch (error){
            console.error ("xxx Database returned an error: \n", error);
        }
    }
};

function getAllEmployees() {
    const sql = `SELECT e.id, e.first_name, e.last_name, r.title, d.dep_name AS department, r.salary, concat(m.first_name," ",m.last_name) AS manager
                FROM employee e
                LEFT JOIN employee m ON e.manager_id = m.id
                LEFT JOIN roles r ON e.role_id = r.id
                LEFT JOIN department d ON r.department_id = d.id`;
    DBCall_getAllEmployees(sql);

    async function DBCall_getAllEmployees(sql) {
        try {
            const results = await db.query(sql);
            if(results) {                
                // console.log("+++ Database returned results: \n", results[0]);
                console.table(results[0]);
                initPrompt();
            }
        
        } catch (error){
            console.error ("xxx Database returned an error: \n", error);
        }
    }
}

function addDepartment() {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the department?',
            validate: (depName) => {
                if(depName) {
                    return true;
                } else {
                    console.log(`Please enter the department name`);
                    return false;
                }
            }
        }
    ]).then(answer => {
        const sql = `INSERT INTO department (dep_name)
        VALUES (?)`;
        const params = [answer.depName];
        DBCall_addDepartment(sql,params);

        async function DBCall_addDepartment(sql,params) {
            try {
                const results = await db.query(sql,params);
                if(results) {                
                    console.log(`+++ Added ${params} to the database`);
                    
                    initPrompt();
                }
            
            } catch (error){
                console.error ("xxx Database returned an error: \n", error);
            }
        }
    })
};

function addRole() {    
    db.query('SELECT dep_name FROM department')
        .then(function(dbResults) {
            const departments = dbResults[0].json();
            
            return inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleName',
                    message: 'What is the name of the role?',
                    validate: (roleName) => {
                        if(roleName) {
                            return true;
                        } else {
                            console.log(`Please enter the role name`);
                            return false;
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?',
                    validate: (salary) => {
                        if(salary) {
                            return true;
                        } else {
                            console.log(`Please enter the salary`);
                            return false;
                        }
                    }
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does the role belong to?',
                    choices: departments
                }
            ])
        }
    
    )
}