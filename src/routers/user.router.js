const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user.model');
const auth = require('../middleware/auth.middleware');
const { sendWelcomeEmail } = require('../emails/account');


const router = new express.Router();

router.get('/', auth, async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

router.get('/me', auth,(req, res) => {
    res.send(req.user);
});

router.get('/:id', auth, async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        sendWelcomeEmail(user.email, user.userName);
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
    } catch (e) {
        console.log(e);
        if(e.keyValue) {
           return res.status(400).send({ error: e.keyValue.email ? 'Email duplicate !' : 'Username duplicate !'});
        }
        res.status(400).send();
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ error: 'Login error please verify your information!' });
    }
});

router.post('/logout', auth,async (req, res) => {
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

router.post('/logoutAll', auth,async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

router.patch('/me', auth,async (req, res) => {
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

router.delete('/me', auth, async (req, res) => {

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
    //dest: 'avatars',
    limits: {
        fileSize: 1000000
    },
    fileFilter (req,file,cb) {

        // if(!file.originalname.endsWith('.pdf')) {
        //   return cb(new Error('Please upload a PDF'));
        // }

        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'))
        }

        return cb(undefined, true);
        // return cb(undefined, false);//sliently reject the file
    }
});

router.post('/me/avatar', auth,upload.single('avatar'),async (req, res) => {

    const buffer = sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

    req.user.avatar = buffer;
    // req.user.avatar = req.file.buffer;
    await req.user.save();
    res.send();
},(error, req, res, next) => {
    res.status(400).send({error: error.message});
});

router.delete('/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
});

router.get('/:id/avatar', auth,async (req, res) => {
    try{
        const user = await User.findById(req.params.id);

        if(!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);

    } catch(e) {
        res.status(400).send();
    }
});

module.exports = router;







