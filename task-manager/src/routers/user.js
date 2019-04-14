const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/users', async (req, res) => {
    
    try {
        const users = await User.find({})
        res.status(200).send(users)
    } catch (e) {
        res.send(e)
    }
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((error) => {
    //     res.send(error)
    // })
})

router.post('/user/login', async (req, res) => {
    console.log('params', req.body.password)
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id) 
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(500).send()
    }
    // User.findById(_id).then((user) => {
    //     if (!user) {
    //         return res.status(404).send()
    //     }
    //     res.send(user)
    // }).catch((e) => {
    //     res.status(500).send()
    // })
})

router.patch('/user/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'age', 'password', 'email']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Updates!' })
    }
    const _id = req.params.id 
    try {

        const user = await User.findById(_id)
        updates.forEach((update) => {
            user[update] = req.body[update]
        })
        await user.save()
        // const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true })
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            res.status(404).send()
        }
        res.send({ 'Deleted User': user })
    } catch (e) {
        res.status(400).send(e)
    }
})

module.exports = router