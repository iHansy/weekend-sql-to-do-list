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



module.exports = taskRouter;