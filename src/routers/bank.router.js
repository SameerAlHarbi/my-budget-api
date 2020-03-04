const express = require('express');
const Bank = require('../models/bank.model')
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const sharp = require('sharp');
const router = new express.Router();

router.get('/banks', auth,async (req, res) => {

    const match = {};
    const sort = {};

    if(req.query.active) {
        match.active = req.query.active === 'true'
    }

    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }

    try{ 
        await req.user.populate({
            path: 'banks' ,
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }          
        }).execPopulate();

        res.send(req.user.banks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/banks/:code', auth,async (req, res) => {
    const code = req.params.code

    try{
        const bank = await Bank.findOne({code, owner: req.user._id});

        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/banks', auth,async (req, res) => {
    const bank = new Bank({
        ...req.body,
        owner: req.user._id
    })

    try{
        await bank.save();
        res.status(201).send(bank);
    } catch (e) {
        res.status(400).send({ error: e.message});
    }
});

router.patch('/banks/:code', auth,async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['code', 'name', 'active'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
       return res.status(400).send({error: 'Invalid update!'});
    }

    try {
        const bank = await Bank.findOne({ code: req.params.code, owner: req.user._id})

        // const bank = await Bank.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true});

        if(!bank) {
             return res.status(404).send()
        }

        updates.forEach(update => bank[update] = req.body[update]);
        await bank.save();
        
        res.send(bank);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

router.delete('/banks/:code', auth,async (req, res) => {

    try{
        const bank = await Bank.findOneAndDelete({code: req.params.code, owner: req.user._id});
        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(400).send();
    }
});

const upload = multer({
    limits: {
        fileSize: 500000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Please upload an image'))
        }

        return cb(undefined, true);
    }   
});

router.post('/Banks/:code/logo', auth, upload.single('logo'), async (req, res) => {

    try{
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();

        const bank = await Bank.findOne({ code: req.params.code, owner: req.user._id });

        if(!bank) {
            return res.status(404).send();
        }

        bank.logo = buffer;
        await bank.save();
        res.send();
    } catch(e) {
        res.status(400).send({error: e.message});
    }   
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message });
});

router.get('/Banks/:code/logo', auth,async (req, res) => {
    try{

        const bank = await Bank.findOne({ code: req.params.code, owner: req.user._id });

        if(!bank) {
            return res.status(404).send();
        }

        if(!bank.logo) {
            throw new Error('Logo Not Found');
        }

        res.set('Content-Type', 'image/png');
        res.send(bank.logo);
    } catch(e) {
        res.status(400).send({ error: e.message });
    }
});

router.get('/banks/accounts',(req,res) => {
    res.send();

})

module.exports = router;