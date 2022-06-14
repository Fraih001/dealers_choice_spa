const express = require('express');
const db = require('./db');
const { User, Task } = db
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('json spaces', 2);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/assets', express.static('assets'));
app.use('/dist', express.static('dist'));

app.get('/', (req, res)=> res.sendFile(path.join(__dirname, 'index.html')));

app.get('/api/users', async(req, res, next)=> {
    try {
        res.send(await User.findAll())
    } catch(er) {
        next(er)
    }
})

app.get('/api/tasks', async(req, res, next)=> {
    try {
        res.send(await Task.findAll())
    } catch(er) {
        next(er)
    }
})

app.delete('/api/users/:id', async(req, res, next)=> {
    try {
      const user = await User.findByPk(req.params.id);
      await user.destroy();
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

app.post('/api/users/', async(req,res,next) => {
    try {
        res.status(201).send( await User.create(req.body))

} catch(er){
    next(er);
}});

app.get('/api/users/:userId/tasks', async(req, res, next)=> {
    try {
        res.send(await Task.findAll({ include: User,
            where: { userId: req.params.userId }
        }))
    } catch(er) {
        next(er)
    }
})

app.post('/api/users/:userId/tasks/', async(req,res,next)=>{
    try {
        res.status(201).send(await Task.create({
            userId: req.params.userId,
            taskTitle: req.body.taskTitle,
            taskDescription: req.body.taskDescription,
            complete: req.body.complete
        }));

    } catch(er) {
        next(er);
    }
})

app.put('/api/users/:userId/tasks/:id', async(req,res,next)=>{
    try {
        const task = await Task.findByPk(req.params.id);
        res.send(await task.update({
            taskTitle: req.body.editTaskTitle,
            taskDescription: req.body.editTaskDescription,
            where: { userid: req.params.userId }
        }));

    } catch(er) {
        next(er);
    }
})

app.delete('/api/tasks/:id', async(req,res,next)=>{
    try {
        const task = await Task.findByPk(req.params.id);
        await task.destroy();
        res.sendStatus(204);

    } catch(er) {
        next(er);
    }
})

app.use((err, req, res, next)=> {
    console.log(err);
    res.status(500).send(err);
})


const init = async() => {
    try {
        await db.syncAndSeed();
        const port = process.env.PORT || 3800
        app.listen(port, ()=> {
        console.log(`we are listening on port ${port}`)
    })
    } catch(er) {
        console.log(er);
    }
}

init();