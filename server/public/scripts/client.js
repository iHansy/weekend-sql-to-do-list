$(document).ready(startProject); 

function startProject() {   
    loadTasks(); // tasks appearing on page load
    $('#taskBtn').on('click', addTask);
    $('#tasksTable').on('click', '.deleteBtn', deleteTask);
    $('#tasksTable').on('click', '.completeBtn', completeTask);


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

            let statusChange = ''; // keeping value of task.status same so I can use it in data-status in completeBtn
            if (task.status === false) {
                statusChange = 'Not completed';
            } else {
                statusChange = 'Complete';
            }
              
            tableBody.append(
                `<tr>
                    <td>${task.task}</td>
                    <td>${task.description}</td>
                    <td>${task.due_date}</td>
                    <td>${statusChange}</td>
                    <td><button class="completeBtn" data-id="${task.id}" data-status="${task.status}">Complete</button></td>
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
        clearInputs();
    }).catch(function(error) {
        alert('error adding task:', error);
    })
} // end addTask

function clearInputs() {
    $('#taskIn').val('')
    $('#descriptionIn').val('')
    $('#dateIn').val('')
} // end clearInputs

function deleteTask() {
    let deleteId = $(this).data('id'); // setting variable to id #
    console.log(deleteId);

    alert('This will delete the selected task.');

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

function completeTask() {
    let completeId = $(this).data('id'); // finding id of task
    let status = $(this).data('status');

    console.log('Marking task as complete...id:', completeId);
    console.log(status);
    let payload = {
        newStatus: !status
    }

    $.ajax({
        type: 'PUT',
        url: `/tasks/${completeId}`,
        data: payload
    }).then(function(response) {
        console.log('back from PUT', response);
        loadTasks(); // reloading DOM with task complete
    }).catch(function(error) {
        alert('ERROR completing task:,' error);
    })
} // end completeTask