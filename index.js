const inquirer = require('inquirer');
const cTable = require('console.table');
const db = require('./db/connection');



// DB setup
// schema setup with lables with foreign keys
// Add data to tables
// create queries for,
    //view all departments
    //view all roles
    //view all employees
    //add a department
    //add a role
    //add an employee
    //update an employee role
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
