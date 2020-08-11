const express = require('express');
const taskRouter = express.Router();
const pg = require('pg');

let config = {};

if (process.env.DATABASE_URL) {

    // heroku gives a url, not a connection object
    const params = url.parse(process.env.DATABASE_URL);
    const auth = params.auth.split(':');

    config = {
        user: auth[0],
        password: auth[1],
        host: params.hostname,
        port: params.port,
        database: params.pathname.split('/')[1],
        ssl: true, // heroku requires ssl to be true
        max: 10, // max number of clients in the pool
        idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before close
    };
} else {
    // SQL local database connection
    config = {
        database: 'weekend-to-do-app',
        host: 'localhost',
        port: 5432,
        max: 10,
        idleTimeoutMillis: 10000
    };
}



const pool = new pg.Pool(config);
// connecting to postgresql
pool.on('connect', () => {
    console.log('connected to postgres');
});
// in case of connection error
pool.on('error', (error) => {
    console.log('error connecting to postgres', error);
});

//ROUTES <------> ROUTES // 
taskRouter.get('/', (req, res) => { // receiving tasks from sql database and sending to client
    // sql code being declared
    let queryText = `SELECT * FROM "tasks" ORDER BY "due_date", "task";`;
    // making request to sql database
    pool.query(queryText).then(result => {
        // sends back the results in an array of objects
        res.send(result.rows); // need to type .rows to just the array, rest of results we don't need
    }).catch(error => {
        console.log('error in GET', error);
        res.sendStatus(500);
    })
}) // end taskRouter.get


taskRouter.post('/', (req, res) => { // sending post request to postgresql database server
    let queryText = `
        INSERT INTO "tasks" ("task", "description", "due_date")
        VALUES ($1, $2, $3);
        `; // sql sanitizing from injection

    if (req.body.due_date === '') { // fixing if user doesn't input date
        req.body.due_date = null;
    }

    console.log(req.body); // sendingTask object from client
    const values = [req.body.task, req.body.description, req.body.due_date]
    pool.query(queryText, values).then(result => {
        console.log(result);
        res.sendStatus(201); // created
    }).catch(error => {
        console.log('error in POST', error);
        res.sendStatus(500);
    })

}) // end taskRouter.post


taskRouter.delete('/:id', (req, res) => { // sending delete request to sql database server
    let id = req.params.id; // id of the thing to delete comes through params
    console.log('delete route called with id of', id);
    let queryText = `DELETE FROM "tasks" WHERE "id" = $1;`;

    // sending query request to database to delete id as parameter
    pool.query(queryText, [id]).then((result) => {
        res.sendStatus(202); // Accepted
    }).catch((error) => {
        console.log('error in DELETE', error)
        // responding back to client if error
        res.sendStatus(500); // internal server error
    })
}) // end taskRouter.delete


taskRouter.put('/:id', (req, res) => { // sending request to sql database to change status to true/completed
    console.log('/tasks PUT:', req.params.id, req.body);
    const queryText = `UPDATE "tasks" SET status = $1 WHERE id = $2;`; // sql code going to database server
    const values = [req.body.newStatus, req.params.id]; //params.id is id and req.body is status being changed to true
    pool.query(queryText, values).then((results) => {
        res.sendStatus(202); // accepted
    }).catch((error) => { // if receiving error from database accepting this update
        console.log('error updating status:', error);
        res.sendStatus(500); // internal server error
    })
}) // end taskRouter.put

module.exports = taskRouter;