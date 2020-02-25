const express = require('express');
const Bank = require('../models/bank.model')
const auth = require('../middleware/auth.middleware');

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
        res.status(400).send(e);
    }
});

router.patch('/banks/:code', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['code', 'name'];
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
        res.status(400).send(e);
    }
});

router.delete('/banks/:code', async (req, res) => {

    try{
        // const bank = await Bank.findByIdAndDelete(req.params.id);
        const bank = await Bank.findOneAndDelete({code: req.params.code, owner: req.uer._id});
        
        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;