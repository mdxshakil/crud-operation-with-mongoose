const express = require('express');
const { default: mongoose } = require('mongoose');
const router = express.Router();
const taskSchema = require('../Schemas/taskSchema');
const TaskModel = new mongoose.model('Task', taskSchema);
const userSchema = require('../Schemas/userSchema');
const UserModel = new mongoose.model("User", userSchema);
const checkLogin = require('../middlewares/checkLogin');

//get all the tasks
router.get('/', checkLogin, async (req, res) => {
    const tasks = await TaskModel.find();
    res.status(200).send(tasks);
})
//get user's task
router.get('/usertask', checkLogin, async (req, res) => {
    const tasks = await TaskModel.find({}).populate("user", "name username -_id"); //here "user" is the property name of user which we set on our schema (-)means dont show this property
    res.status(200).send(tasks);
})

//get a single task
router.get('/single/:id', async (req, res) => {
    const task = await TaskModel.find({ _id: req.params.id })
    res.status(200).send(task);
})

//post a task
router.post('/', checkLogin, async (req, res) => {
    try {
        const newTask = new TaskModel({
            ...req.body, //everything from req.body
            user: req.userId // userId from jwt verification
        });
        await UserModel.updateOne(
            {_id: req.userId},
            {
                $push: {
                    tasks: newTask._id //schema property name
                }
            }
            )
        const data = await newTask.save();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err.message);
    }
    // ~~~~~~~~~~~ using callbacks ~~~~~~~~~~~ //
    // const newTask = new TaskModel(req.body);
    // const data = newTask.save((err,data)=>{
    //     if (err) {
    //         res.json(err.message).status(500)
    //     }else{
    //         res.json(data)
    //     }
    // })
})

// post multiple task
router.post('/all', async (req, res) => {
    try {
        const data = await TaskModel.insertMany(req.body);
        res.status(200).send({ message: 'Tasks added successfully', data });
    } catch (error) {
        res.status(500).json(error.message);
    }
})

//update a task
router.put('/:id', (req, res) => {
    const id = req.params.id
    TaskModel.updateOne({ _id: id }, {
        $set: {
            name: 'Learn CSS',
            description: 'Cascading stylesheet'
        }
    }, (err) => {
        if (err) {
            res.status(500).json({ Error: 'Updating failed' })
        }
        else {
            res.status(200).send({ Message: 'Updated Successfully' })
        }
    })
    res.send('Updated successfully')
})

//delete a task
router.delete('/:id', (req, res) => {
    TaskModel.deleteOne({ _id: req.params.id }, (err) => {
        if (err) {
            res.status(200).send({ Error: "Could not delete" })
        }
        else {
            res.status(200).send({ Success: 'Deleted Successfully' })
        }
    });
})

// ====================================================== //
// = get result according to our schema instance method = //
// ====================================================== //
router.get('/active', async (req, res) => {
    const todo = new TaskModel();
    const data = await todo.findActive();
    res.status(200).json({ data });
})
// ====================================================== //
// = get result according to our schema statics method = //
// ====================================================== //
router.get('/framework', async (req, res) => {
    try {
        const data = await TaskModel.findFramework();
        res.send({ data }).status(200);
    } catch (error) {
        res.send(error.message).status(500);
    }
})

// ====================================================== //
// = get result according to our schema query method = //
// ====================================================== //
router.get('/description', async (req, res) => {
    const query = req.query.text;
    const data = await TaskModel.find().findDescription(query);
    res.status(200).send({ data });
})
module.exports = router;