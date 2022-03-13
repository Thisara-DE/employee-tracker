const db = require('./db/connection');
const cTable = require('console.table');

//view all departments
//add a department

class Department {
    constructor(id,dep_name) {
        this.id = id;
        this.dep_name = dep_name;
    }
    
}



module.exports = Department;