const Sequelize = require('sequelize')
const { STRING, INTEGER, UUID, UUIDV4, BOOLEAN, DATE } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/dealers_choice_spa')

const User = conn.define('user', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true
    },
    name: {
        type: STRING(15),
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true
        }
    },
    numOfTasksInProgress: {
        type: INTEGER
    },
    numOfTasksComplete: {
        type: INTEGER
    }
})

const Task = conn.define('task', {
    id: {
        type: UUID,
        defaultValue: UUIDV4,
        primaryKey: true,
    },
    taskTitle: {
        type: STRING(30),
    },
    taskDescription: {
        type: STRING(100),
    },
    complete: {
        type: BOOLEAN
    },
    completeOn: {
        type: DATE
    },
})

Task.belongsTo(User);

const syncAndSeed = async() => {
    await conn.sync({ force: true });
    const [alex, colleen, prof, colton, jonathan] = await Promise.all([
        User.create({name: 'alex'}),
        User.create({name: 'colleen'}),
        User.create({name: 'prof'}),
        User.create({name: 'colton'}),
        User.create({name: 'jonathan'}),
        
        ])
        const tasks = await Promise.all([
            Task.create({userId: colleen.id, taskTitle: 'exercise', taskDescription: 'workout for 30min'}),
            Task.create({userId: colton.id, taskTitle: 'walk dog', taskDescription: 'walk dog in the AM'}),
            Task.create({userId: prof.id, taskTitle: 'dishes', taskDescription: 'wash dishes after work'})


        ])

}

module.exports = {
    syncAndSeed, User, Task
}