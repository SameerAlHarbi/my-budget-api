const express = require('express');
const Beneficiary = require('../models/beneficiary');
const router = new express.Router();

router.get('/beneficiaries', async (req, res) => {
    try {
        const beneficiaries = await Beneficiary.find({});
        res.send(beneficiaries);
    } catch (e) {
        res.status(500).send();
    }
});

router.get('/beneficiaries/:id', async (req, res) => {
    const _id = req.params.id;

    try {
        const benficiary = await Beneficiary.findById(_id);

        if(!benficiary) {
            return res.status(404).send();
        }

        res.send(benficiary);
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/beneficiaries', async (req, res) => {
    const beneficiary = new Beneficiary(req.body);
    
    try {
        await beneficiary.save();
        res.status(201).send(beneficiary);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.patch('/beneficiaries/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'relationType'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid update!'})
    }

    try {
        const beneficiary = await Beneficiary.findByIdAndUpdate(req.params.id, req.body
            , {new: true, runValidators: true});

        if(!beneficiary) {
            return res.status(404).send();
        }

        res.send(beneficiary);
    } catch (e) {
        res.status(400).send();
    }
})

router.delete('/beneficiaries/:id', async (req, res) => {

    try {

        const beneficiary = await Beneficiary.findByIdAndDelete(req.params.id);

        if(!beneficiary) {
            return res.status(404).send();
        }

        res.send(beneficiary);

    } catch(e) {
        res.status(500).send();
    }

});


module.exports = router;