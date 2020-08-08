const express = require('express'); //
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const taskRouter = require('./routes/tasks.router');

app.use(bodyParser.urlencoded({extended:true})); // allowing us to get data from client side
app.use(express.static('server/public')); // giving us access to all files in server/public

// routes
app.use('/tasks', taskRouter);

// start listening for requests on a specific port
app.listen(PORT, () => {
    console.log('listening on port', PORT);
})