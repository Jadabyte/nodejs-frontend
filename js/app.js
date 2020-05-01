fetch("http://localhost:3000/api/v1/todos", {
    'headers': {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
}).then(result => {
    return result.json();
}).then(json => {
    console.log(json);
}).catch(err => {
    console.log("🍌🍌🍌");
});

// add a todo on enter
let input = document.querySelector(".todo__input");
input.addEventListener("keyup", e => {
    if(e.keyCode === 13) {
        // on enter
        let text = input.value;
        fetch("http://localhost:3000/api/v1/todos", {
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
            let todo = `<div class="todo">
            <input data-id="${json.data.todo._id}" type="checkbox" class="todo__state">
            <div class="todo__text">${json.data.todo.text}<div>
            <a class="todo__delete" href="#" data-id="${json.data.todo._id}">delete</a>
            </div>`;
            document.querySelector(".todo__new").insertAdjacentHTML('afterend', todo);
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

        fetch("http://localhost:3000/api/v1/todos/" + todoId, {
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