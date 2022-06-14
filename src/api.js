const axios = require('axios');

const fetchUsers = async() => {
    return axios.get('/api/users/')
}

const fetchTasks = async({ hash }) => {
    return await axios.get(`/api/users/${hash}/tasks`);
}

const deleteTask = async({ id }) => {
    return await axios.delete(`/api/tasks/${id}`)
}

const deleteUser = async({ id }) => {
   return await axios.delete(`/api/users/${id}`)
}

const editTask = async({ userId, id, editTaskTitle, editTaskDescription }) => {
    const response = await axios.put(`/api/users/${userId}/tasks/${id}`, {
        editTaskTitle,
        editTaskDescription
    });

    return response.data
}

const createTask = async({ userId, taskTitle, taskDescription }) => {
    const response = await axios.post(`/api/users/${userId}/tasks`, {
        userId: userId,
        taskTitle: taskTitle,
        taskDescription: taskDescription,
        complete: false
    });
    
    return response.data
}

const createUser = async({ newUser }) => {
    const response = await axios.post('/api/users', {
        name: newUser
    });
    return response.data
}



module.exports = {
    fetchUsers,
    fetchTasks,
    deleteTask,
    deleteUser,
    editTask,
    createTask,
    createUser
}