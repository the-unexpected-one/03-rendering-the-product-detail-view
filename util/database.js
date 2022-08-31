const mysql= require('mysql2')

//instead of a collection we create a collection pool. This alows to always reach out to it whenever we have a query to run and we can manage multiple queries simultaneously as each query need sits own connection
const pool=mysql.createPool({
    host: 'localhost',
    user:'root',
    database: 'node-complete',
    password:'Saloni@22'
});
module.exports=pool.promise();
