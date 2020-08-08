$(document).ready(startProject); 

function startProject() {   
    loadTasks();
    
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
            console.log(task.due_date);

            if (task.due_date === null || '') {
                task.due_date = 'no due date';
            } else {
                let date = task.due_date;
                date = date.slice(0, -14);
                task.due_date = date; // sliced off timestamp
            }
              
            
            

            tableBody.append(
                `<tr>
                    <td>${task.task}</td>
                    <td>${task.description}</td>
                    <td>${task.due_date}</td>
                    <td>${task.status}</td>
                    <td><button>Complete</button></td>
                    <td><button>Delete</button></td>
                </tr>`)
        }


    }).catch(function(error) { // in case response from server is broken
        console.log('error in loadTasks GET', error);
    })
} // end loadTasks