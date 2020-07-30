const express = require('express')
const router = new express.Router()
const auth = require('../middleware/authentication')
const Task = require('../models/Task')

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=created_desc
router.get('/tasks', auth, async (req, res) => {
    const match = {owner: req.user._id}
    const options = {}

    if(req.query.completed) match.completed = req.query.completed === 'true'
    if(req.query.limit) options.limit = parseInt(req.query.limit)
    if(req.query.skip) options.skip = parseInt(req.query.skip)
    if(req.query.sortBy) {
        options.sort = {}

        const sortParts = req.query.sortBy.split('_')
        const sortTerm = sortParts[0]
        const sortOrder = (sortParts[1] === 'asc') ? 1 : -1
        options.sort[sortTerm] = sortOrder
    }

    try {
        const tasks = await Task.find(match, null, options)
        //await req.user.populate({path: 'task', match: {completed:true}, options: {limit: 2} }).execPopulate()
        res.status(202).send(tasks) // || req.user.tasks
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task = await Task.findOne( {_id, owner: req.user._id} )

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

router.post("/tasks", auth, async (req, res) => {
    //const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        'owner': req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.patch("/tasks/:id", auth, async (req, res) => {
    const updatedFields = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidFields = updatedFields.every((field) => allowedUpdates.includes(field))

    try {
        if(!isValidFields) throw {'Error': 'Invalid Fields'}

        const task = await Task.findOne( { _id:req.params.id, owner: req.user._id} )

        if(!task) res.status(404).send()

        updatedFields.forEach((field) => {
            task[field] = req.body[field]
        })
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete("/tasks/:id", auth, async (req, res) => {
    const _id = req.params.id

    try {
        const task = await Task.findOneAndDelete( {_id, owner: req.user._id} )

        if(!task) return res.status(404).send()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router