const express = require('express');
const taskRouter = express.Router();
const pg = require('pg');

// SQL database connection
const config = {
    database: 'weekend-to-do-app',
    host: 'localhost',
    port: 5432,
    max: 10,
    idleTimeoutMillis: 10000
}

const pool = new pg.Pool(config);
// connecting postgres
pool.on('connect', () => {
    console.log('connected to postgres');
});
// in case of connection error
pool.on('error', (error) => {
    console.log('error connecting to postgres', error);
});

// receiving tasks from sql database and sending to client
taskRouter.get('/', (req, res) => {
    // sql code being declared
    let queryText = `SELECT * FROM "tasks" ORDER BY "due_date";`;
    // making request to sql database
    pool.query(queryText).then(result => {
        // sends back the results in an array of objects
        res.send(result.rows); // need to type .rows to just the array, rest of results we don't need
    }).catch(error => {
        console.log('error getting koalas', error);
        res.sendStatus(500);
    })
}) // end taskRouter.get



module.exports = taskRouter;