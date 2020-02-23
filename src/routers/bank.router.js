const express = require('express');
const Bank = require('../models/bank.model')
const auth = require('../middleware/auth.middleware');

const router = new express.Router();

router.get('/banks', auth,async (req, res) => {

    try{
        // console.log(req.query);
        // setTimeout(async () => {
        //     const banks = await Bank.find({});
        //     res.send(banks);
        // }, 3000);

        // const banks = await Bank.find({ owner: req.user._id});
        await req.user.populate('banks').execPopulate();
        res.send(req.user.banks);

    } catch (e) {
        res.status(500).send();
    }
});

router.get('/banks/:id', auth,async (req, res) => {
    
    try{
        // const bank = await Bank.findById(req.params.id);
        const bank = await Bank.findOne({_id: req.params.id, owner: req.user._id});

        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/banks', async (req, res) => {
    // const bank = new Bank(req.body);
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

router.patch('/banks/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['code', 'name'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
       return res.status(400).send('Invalid update!');
    }

    try {
        const bank = await Bank.findOne({ _id = req.params.id, owner: req.user._id})

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

router.delete('/banks/:id', async (req, res) => {

    try{
        // const bank = await Bank.findByIdAndDelete(req.params.id);
        const bank = await Bank.findOneAndDelete({_id: req.params.id, owner: req.uer._id});
        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;