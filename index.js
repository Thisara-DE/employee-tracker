//Importing npm packages and db connection
const inquirer = require('inquirer');
const db = require('./db/connection');
const cTable = require('console.table');

// initializing user prompts
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
                updateEmployeeRole();
                break;
            case 'Update employee manager':
                updateEmployeeManager();                
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDep();
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


// View all departments
function getAllDepartments() {
    const sql = `SELECT id, dep_name AS name FROM department`;    
    DBCall_getAllDepartments(sql);

    async function DBCall_getAllDepartments(sql,params){
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

// View all roles
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

// View all employees
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

// Add a department 
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

// Add a role
function addRole() {    
    db.query('SELECT dep_name FROM department')
        .then(function(dbResults) {
            const departments = [];
            dbResults[0].forEach(result => {
                departments.push(result.dep_name);                
            })           
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
            ]).then(answers => {
                const sql = `INSERT INTO roles (title, salary, department_id) 
                            VALUES (?,?,?)`;
                const department_id = departments.indexOf(answers.department) + 1;                                
                const params = [answers.roleName,answers.salary,department_id];

                DBCall_addRole(sql,params);

                async function DBCall_addRole(sql,params) {
                    try {
                        const results = await db.query(sql,params);
                        if(results) {                
                            console.log(`+++ Added ${params[0]} to the database`);
                            
                            initPrompt();
                        }
                    
                    } catch (error){
                        console.error ("xxx Database returned an error: \n", error);
                    }
                }
            })
        }    
    )
};

// Add an employee
function addEmployee() {
    db.query("SELECT concat(e.first_name,' ',e.last_name) AS name,r.title FROM employee e RIGHT JOIN roles r ON e.role_id = r.id ORDER BY e.id")
        .then(function(dbResults) {
            const roles = [];
            const managers = ['None'];
            dbResults[0].forEach(result => {
                if(roles.indexOf(result.title) === -1) {
                roles.push(result.title);  
                }              
            })
            dbResults[0].forEach(result => {
                if(result.name != null) {
                managers.push(result.name);
                }                
            })
            
        return inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?",
                validate: (firstName) => {
                    if(firstName) {
                        return true;
                    } else {
                        console.log(`Please enter the employee's first name`);
                        return false;
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?",
                validate: (lastName) => {
                    if(lastName) {
                        return true;
                    } else {
                        console.log(`Please enter the employee's last name`);
                        return false;
                    }
                }
            },
            {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'list',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: managers
            }
        ]).then(answers => {
            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES (?,?,?,?)`;
            const role_id = roles.indexOf(answers.role) + 1;
            const manager_id = managers.indexOf(answers.manager) - 1;                                
            const params = [answers.firstName,answers.lastName,role_id,manager_id];
            
            DBCall_addEmployee(sql,params);

            async function DBCall_addEmployee(sql,params) {
                try {
                    const results = await db.query(sql,params);
                    if(results) {                
                        console.log(`+++ Added ${params[0]} to the database`);
                        
                        initPrompt();
                    }
                
                } catch (error){
                    console.error ("xxx Database returned an error: \n", error);
                }
            }
        })
    })
};

// Update an employee role
function updateEmployeeRole() {
    db.query("SELECT concat(e.first_name,' ',e.last_name) AS name,r.title FROM employee e RIGHT JOIN roles r ON e.role_id = r.id ORDER BY e.id")
        .then(function(dbResults) {
            const roles = [];
            const employees = [];
            dbResults[0].forEach(result => {
                if(roles.indexOf(result.title) === -1){
                roles.push(result.title);  
                }              
            })
            dbResults[0].forEach(result => {
                if(result.name != null) {
                    employees.push(result.name);
                }                
            })
        inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: "What is the employee's role?",
                choices: employees
            },
            {
                type: 'list',
                name: 'role',
                message: "Who is the employee's manager?",
                choices: roles
            }
        ]).then(answers => {
            const sql = `UPDATE employee
                        SET role_id = ?
                        WHERE id = ?`;
            const role_id = roles.indexOf(answers.role) + 1;
            const employee_id = employees.indexOf(answers.employee) + 1;                                
            const params = [role_id,employee_id];
            
            DBCall_addEmployee(sql,params);

            async function DBCall_addEmployee(sql,params) {
                try {
                    const results = await db.query(sql,params);
                    if(results) {                
                        console.log(`+++ Added ${params[0]} to the database`);
                        
                        initPrompt();
                    }
                
                } catch (error){
                    console.error ("xxx Database returned an error: \n", error);
                }
            }
        })
    })
};

// Update employee manager
function updateEmployeeManager() {
    db.query("SELECT concat(e.first_name,' ',e.last_name) AS name FROM employee e ORDER BY e.id")
        .then(dbEmployeeList => {
            const employeeArr = [];
            dbEmployeeList[0].forEach(employee => {
                employeeArr.push(employee.name);                
            })            
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'employee',
                    message: "Which employee's manager do you want to change?",
                    choices: employeeArr
                }
            ]).then(answer => {
                const employee_id = employeeArr.indexOf(answer.employee) + 1;
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'manager',
                        message: "Who do you want to assign as the new manager?",
                        choices: employeeArr
                        // validate: (manager) => {
                        //     if(manager === employeeArr[employee_id] -1) {
                        //         console.log('Please select a different person');
                        //         console.log(employeeArr[employee_id] -1);
                        //     }
                        // }
                    }
                ])
                .then(selection => {
                    const manager_id = employeeArr.indexOf(selection.manager) + 1;
                    const sql = `UPDATE employee
                        SET manager_id = ?
                        WHERE id = ?`;
                    const params = [manager_id, employee_id]
                    
                    DBCall_updateManager(sql,params);

                    async function DBCall_updateManager(sql,params) {
                        try {
                            const results = await db.query(sql,params);
                            if(results) {                
                                console.log(`+++ Updated the manager of employee# ${params[1]}`);
                                
                                initPrompt();
                            }
                        
                        } catch (error){
                            console.error ("xxx Database returned an error: \n", error);
                        }
                    }
                })
            })            
        })
};

// View employees by manager
function viewEmployeesByManager(){
    const sql = `SELECT e.id as manager_id, concat(e.first_name,' ', e.last_name) AS manager,
                concat(m.first_name,' ', m.last_name) AS employee 
                FROM employee e LEFT JOIN employee m ON m.manager_id = e.id 
                WHERE m.id is NOT NULL`;
    
    DBCall_viewEmployeesByManager(sql);

    async function DBCall_viewEmployeesByManager(sql,params){
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

function viewEmployeesByDep() {
    const sql = `SELECT d.dep_name AS department, r.title, concat(e.first_name," ", e.last_name) AS employee
                FROM employee e
                LEFT JOIN roles r ON e.role_id = r.id
                LEFT JOIN department d ON r.department_id = d.id`;
    
    DBCall_viewEmployeesByManager(sql);

    async function DBCall_viewEmployeesByManager(sql,params){
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
}