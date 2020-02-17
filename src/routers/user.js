const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const user = await User.findById(_id);

        if(!user) {
           return res.status(404).send();
        }

        res.send(user);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    console.log(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/users/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['userName','email', 'password'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send('Invalid update!');
    }

    try {
        const user = await User.findById(req.params.id);
        console.log(user);
        updates.forEach(update => user[update] = req.body[update]);
        console.log(user);
        await user.save();
        if(!user) {
           return res.status(404).send();
        }

        res.send(user);

    } catch (e) {
        res.status(400).send(e);
    }

});

router.delete('/users/:id', async (req, res) => {

    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if(!user) {
            return res.status(404).send();
        }
        
        res.send(user);
    } catch (e) {
        res.status(500).send();
    }

})




module.exports = router;






