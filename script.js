document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const loginForm = document.getElementById('loginForm');
    const todoForm = document.getElementById('todoForm');
    const loggedInUserDiv = document.getElementById('loggedInUser');
    const todoListDiv = document.getElementById('todoList');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    function renderUser() {
        if (currentUser) {
            loggedInUserDiv.innerText = `Logged in as: ${currentUser.email}`;
        } else {
            loggedInUserDiv.innerText = '';
        }
    }

    function renderTodos() {
        todoListDiv.innerHTML = '';
        if (currentUser) {
            const userTodos = todos.filter(todo => todo.user_id === currentUser.uid);
            userTodos.forEach(todo => {
                const todoItem = document.createElement('div');
                todoItem.innerText = `${todo.title}: ${todo.description} - ${todo.date}`;
                todoListDiv.appendChild(todoItem);
            });
        }
    }

    registrationForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        if (users.some(user => user.email === email)) {
            alert('User already registered');
        } else {
            const user = {
                email,
                password,
                uid: Date.now().toString(),
                status: 'active',
                createdAt: new Date()
            };
            users.push(user);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful');
        }
    });

    loginForm.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            renderUser();
            renderTodos();
            alert('Login successful');
        } else {
            alert('Invalid email or password');
        }
    });

    todoForm.addEventListener('submit', event => {
        event.preventDefault();
        if (!currentUser) {
            alert('You need to log in to add to-dos');
            return;
        }

        const title = document.getElementById('todoTitle').value;
        const description = document.getElementById('todoDescription').value;
        const date = document.getElementById('todoDate').value;

        const todo = {
            title,
            description,
            date,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date(),
            user_id: currentUser.uid
        };

        todos.push(todo);
        localStorage.setItem('todos', JSON.stringify(todos));
        renderTodos();
        alert('To-Do added');
    });

    renderUser();
    renderTodos();
});
