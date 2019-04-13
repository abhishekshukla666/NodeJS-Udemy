const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.post('/tasks', async (req, res) => {
    const task = new Task(req.body)

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

router.get('/tasks', async (req, res) => {
    try {
        const task = await Task.find({})
        res.status(200).send(task)
    } catch (e) {
        res.send(e)
    }
})

router.get('/task/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(400).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.send(e)
    }
})

router.patch('/task/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }

    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, { isValidOperation: true, new: true })
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/task/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findByIdAndDelete(_id)
        if (!task) {
            return res.status(404).send()
        }
        res.send({'Deleted Task': task})
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router