const base_url = "https://todo-nodejs-jadabyte.herokuapp.com";

// primus live
primus = Primus.connect("http://localhost:3000", {
    reconnect: {
        max: Infinity // Number: The max delay before we try to reconnect.
            ,
        min: 500 // Number: The minimum delay before we try reconnect
            ,
        retries: 10 // Number: How many times we should try to reconnect.
    }
});

primus.on('data', (json) => {
    if(json.action === "addTodo") {
        appendTodo(json.data);
    }
});

// redirect if not logged in
if(!localStorage.getItem("token")){
    window.location.href = "login.html";
}

// fetches all todos when loaded
fetch(base_url + "/api/v1/todos", {
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(result => {
    return result.json();
}).then(json => {
    json.data.todos.forEach(todos => {
        if(todos.completed){
            var newTodo = `<div class ="todo todo--completed">
                <input data-id="${todos._id}" type="checkbox" class="todo__state">
                <div class="todo__text">${todos.text}</div>
                <a class="todo__delete" href="#" data-id="${todos._id}">delete</a>
            </div>`;
        } else {
            var newTodo = `<div class ="todo">
            <input data-id="${todos._id}" type="checkbox" class="todo__state">
            <div class="todo__text">${todos.text}</div>
            <a class="todo__delete" href="#" data-id="${todos._id}">delete</a>
        </div>`;
        }
        document.querySelector(".todo__new").insertAdjacentHTML('afterend', newTodo);
    })
}).catch(err => {
    console.log("Something broke");
});

// append a todo to the dom
let appendTodo = (json) => {
    let todo = `<div class="todo">
        <input data-id="${json.data.todo._id}" type="checkbox" class="todo__state">
        <div class="todo__text">${json.data.todo.text}<div>
        <a class="todo__delete" href="#" data-id="${json.data.todo._id}">delete</a>
    </div>`;
    document.querySelector(".todo__new").insertAdjacentHTML('afterend', todo);
    }

// add a todo on enter
let input = document.querySelector(".todo__input");
input.addEventListener("keyup", e => {
    if(e.keyCode === 13) {
        // on enter
        let text = input.value;
        fetch(base_url + "/api/v1/todos", {
            method: "post",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "text": text
            })
        }).then(result => {
            return result.json();
        }).then(json => {
            input.value = "";
            input.focus();

            primus.write({
                "action": "addTodo",
                "data": json
            });

            //appendTodo(json);

        }).catch(err => {
            console.log(err);
        })
    }
    e.preventDefault();
});

// mark as completed
document.querySelector(".app").addEventListener("change", e => {
    if(e.target.classList.contains("todo__state")){
        let todoId = e.target.getAttribute("data-id");

        fetch(base_url + "/api/v1/todos/" + todoId, {
            method: "put",
            'headers': {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify({
                "todoId": todoId
            })
        }).then(result => {
            return result.json();
        }).then(json => {
            if(json.status === "success"){
                e.target.parentElement.classList.add("todo--completed");
            }
            console.log(json);
        }).catch(err => {
            console.log(err);
        })

    }
});