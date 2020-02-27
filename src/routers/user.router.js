const express = require('express');
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');

const router = new express.Router();

router.get('/users', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/users/me', auth,(req, res) => {
    res.send(req.user);
});

router.get('/users/:id', auth, async (req, res) => {
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
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
});

router.post('/users/logout', auth,async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', auth,async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/users/me', auth,async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['userName','email', 'password'];
    const isValidOperation = updates.every( update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send('Invalid update!');
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);

    } catch (e) {
        res.status(400).send(e);
    }

});

router.delete('/users/me', auth, async (req, res) => {

    try {
        // const user = await User.findByIdAndDelete(req.user._id);

        // if(!user) {
        //     return res.status(404).send();
        // }

        await req.user.remove();
        
        res.send(req.user);
    } catch (e) {
        res.status(500).send();
    }

});

const upload = multer({
    dest: 'images'
});

router.post('/users/me/avatar', upload.single('avatar'), (req, res) => {
    res.send();
});

module.exports = router;







