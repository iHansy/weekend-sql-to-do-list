$(document).ready(startProject); 

function startProject() {   
    loadTasks(); // tasks appearing on page load
    $('#taskBtn').on('click', addTask);
    $('#tasksTable').on('click', '.deleteBtn', deleteTask);


} // end startProject

function loadTasks() {
    console.log('loading tasks...');
    // ajax request to server
    $.ajax ({
        type: 'get',
        url: '/tasks',
    }).then(function(response) {
        console.log(response);
        let tasksList = response; // response is an array of tasks objects
        let tableBody = $('#tasksTable'); // setting element to tbody
        tableBody.empty(); // emptying DOM on so no duplicates on load

        for (task of tasksList) { // appending for each task object
        
            if (task.due_date === null || '') {
                task.due_date = 'no due date'; // changing due_date if no input
            } else {
                let date = task.due_date;
                date = date.slice(0, -14);
                task.due_date = date; // sliced off timestamp
            } // end if..else

            if (task.status === false) {
                task.status = 'Not completed';
            } else {
                task.status = 'Complete';
            }
              
            tableBody.append(
                `<tr>
                    <td>${task.task}</td>
                    <td>${task.description}</td>
                    <td>${task.due_date}</td>
                    <td>${task.status}</td>
                    <td><button class="completeBtn" data-id="${task.id}">Complete</button></td>
                    <td><button class="deleteBtn" data-id="${task.id}">Delete</button></td>
                </tr>`)
        }


    }).catch(function(error) { // in case response from server is broken
        console.log('error in loadTasks GET', error);
    })
} // end loadTasks

function addTask() {
    console.log('adding task...');
    let sendingTask = { // storing user inputs in an object, send to server/database
        task: $('#taskIn').val(),
        description: $('#descriptionIn').val(),
        due_date: $('#dateIn').val(),
    }
    console.log('new task is:', sendingTask);

    $.ajax({
        type: 'POST',
        url: '/tasks',
        data: sendingTask,
    }).then(function(response) { 
        console.log('back from POST:', response);
        loadTasks(); // reloading DOM with updated tasks from sql database
    }).catch(function(error) {
        alert('error adding task:', error);
    })
} // end addTask

function deleteTask() {
    let deleteId = $(this).data('id'); // setting variable to id #
    console.log(deleteId);

    $.ajax({
        type: 'DELETE',
        url: `/tasks/${deleteId}`
    }).then(function(response) {
        console.log(response);
        loadTasks(); // reloading DOM with updated task table
    }).catch(function (error) {
        console.log('error while deleting task', error);
    })
} // end deleteTask