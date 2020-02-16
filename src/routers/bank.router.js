const express = require('express');
const Bank = require('../models/bank.model')

const router = new express.Router();

router.get('/banks', async (req, res) => {

    try{
        const banks = await Bank.find({});
        res.send(banks);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/banks/:id', async (req, res) => {
    
    try{
        const bank = await Bank.findById(req.params.id);

        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(500).send();
    }
});

router.post('/banks', async (req, res) => {
    const bank = new Bank(req.body);

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
        const bank = await Bank.findByIdAndUpdate(req.params.id, req.body, { new: true , runValidators: true});

        if(!bank) {
             return res.status(404).send()
        }

        res.send(bank);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.delete('/banks/:id', async (req, res) => {

    try{
        const bank = await Bank.findByIdAndDelete(req.params.id);
        if(!bank) {
            return res.status(404).send();
        }

        res.send(bank);
    } catch (e) {
        res.status(400).send();
    }
});

module.exports = router;