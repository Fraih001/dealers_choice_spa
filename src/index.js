const api = require('./api')

const state = {}

const numOfUsers = document.querySelector('#numberOfUsers');
const userList = document.querySelector('#users-list');
const createUserForm = document.querySelector('#createuser');
const createUserInput = document.querySelector('#createuserinput');
const taskList = document.querySelector('#tasks-list');
const createTaskForm = document.querySelector('#createtask');
const createTaskTitleInput = document.querySelector('#tasktitle');
const createTaskDescriptionInput = document.querySelector('#taskdescription');

createUserForm.addEventListener('submit', async(ev) => {
    ev.preventDefault();
    const newUser = createUserInput.value;
    const user = await api.createUser({ newUser })
    state.users.push(user);
    window.location.hash = user.id;
    createUserInput.value = "";
       
});

createTaskForm.addEventListener('submit', async(ev) => {
    ev.preventDefault();
    const userId = window.location.hash.slice(1);
    const taskTitle = createTaskTitleInput.value;
    const taskDescription = createTaskDescriptionInput.value;    
    const task = await api.createTask({ userId, taskTitle, taskDescription });
    state.tasks.push(task);
    renderTasks();
    createTaskTitleInput.value = "";
    createTaskDescriptionInput.value = "";
});

taskList.addEventListener('submit', async(ev) => {
    ev.preventDefault();
    const userId = window.location.hash.slice(1);
    const id = ev.target.getAttribute('data-id');
    let taskTitle = document.querySelector('#edittasktitle');
    let taskDescription = document.querySelector('#edittaskdescription');
    let editTaskTitle = taskTitle.value;
    let editTaskDescription = taskDescription.value;

    let editedTask = await api.editTask({ userId, id, editTaskTitle, editTaskDescription });
    console.log({ editedTask })
    console.log(state.tasks)
    let task = state.tasks.find(task => task.id === editedTask.id)
    console.log( {task} )

    task = editedTask;
    await fetchTasks()
    renderTasks();
    editTaskTitle.value = "";
    editTaskDescription.value = "";
    document.querySelector('#edittaskform').hidden = true;

});

userList.addEventListener('click', async(ev)=> {
    if(ev.target.tagName === 'BUTTON'){
      const id = ev.target.getAttribute('data-id');
      await api.deleteUser({ id })
      state.users = state.users.filter(user => user.id !== id);
      renderUsers();
    }
});

taskList.addEventListener('click', async(ev)=> {
    if(ev.target.id === 'deletetask'){
      const id = ev.target.getAttribute('data-id');
      await api.deleteTask({ id });
      state.tasks = state.tasks.filter(task => task.id !== id);
      renderTasks();
    }
});

taskList.addEventListener('click', (ev)=> {
    if(ev.target.id === 'edittask'){
        document.querySelector('#edittaskform').hidden = false;
    }
});

const renderTasks = () => {
    const html = state.tasks.map( task => {
        const user = state.users.find(user => user.id === task.userId);
        return `
        <form id='edittaskform' data-id='${task.id}' hidden>
                <h3>Edit Your Task Below!</h3>
                <div id=editform>
                <input id='edittasktitle' placeholder="Edit the Title of your Task!" />
                <textarea id='edittaskdescription' placeholder="Edit the Description of your Task!"></textarea>
                <button id='edittaskbutton'> SUBMIT EDIT </button>
                </div>
            </form>

        <li id='li-task' data-id='${task.id}'>
    
        <div id='taskdesc'>
            ${ user.name.toUpperCase() } |
            ${ task.taskTitle } <br/><br/>
            ${ task.taskDescription }
        </div>
            
            <div id='editdeletebuttons'>
            <button id="deletetask" data-id='${task.id}'>X</button>
            <button id="edittask">EDIT</button>
            </div>
        </li>
        `
    }).join("");

    taskList.innerHTML = html;
};

const renderUsers = ()=> {
    const hash = window.location.hash.slice(1);
    const html = state.users.map( user => {
      return `
        <li class='${ user.id === hash ? 'selected' : ""}'>
        <a href="#${user.id}">
          ${ user.name.toUpperCase() }
          </a>
          <button data-id='${user.id}'>X</button>
        </li>
      `;
    }).join('');
    userList.innerHTML = html;
};

const renderNumOfUsers = () => {
    const html = `
        SPA To Do List - Currently, ${state.users.length} people are using this app!
        `
    numOfUsers.innerHTML = html;
}

const fetchTasks = async() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
    const response = await api.fetchTasks({ hash })
    state.tasks = response.data
    } else {
        state.tasks = [];
    }
};

const fetchUsers = async() => {
    const response = await api.fetchUsers();
    state.users = response.data;

};

window.addEventListener('hashchange', async() => { 
    await fetchTasks();
    renderTasks();
    renderNumOfUsers();
    renderUsers();
});

const start = async()=> {
    await fetchTasks();
    await fetchUsers();
    renderTasks();
    renderUsers();
    renderNumOfUsers();
    
  };
  
  start();


