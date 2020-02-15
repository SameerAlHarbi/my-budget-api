const express = require('express');
const Relation = require('../models/relation');
const router = new express.Router();

router.get('/relations',async (req, res) => {

    try {
        const relations = await Relation.find({});
        res.send(relations);
    } catch(e) {
        res.status(500).send();
    }
});

router.get('/relations/:id',async (req, res) => {
    const _id = req.params.id;

    try {
        const relation = await Relation.findById(_id);

        if(!relation) {
            return res.status(404).send();
        }

        res.send(relation);
    } catch (e) {
        res.status(500).send();
    }
    
});

router.post('/relations', async (req, res) => {
    const relation = new Relation(req.body);

    try {
        await relation.save();
        res.status(201).send(relation);
    } catch (e) {
        res.status(400).send(e);
    }
});

router.patch('/relations/:id', async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if(!isValidOperation) {
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try {
        const relation = await Relation.findByIdAndUpdate(req.params.id,req.body, {new: true, runValidators: true});

        if(!relation) {
            return res.status(404).send();
        }

        res.send(relation);
    } catch (e){
        res.status(400).send(e);
    }
})

router.delete('/relations/:id', async (req, res) => {
    try {
        const relation = await Relation.findByIdAndDelete(req.params.id)

        if (!relation) {
           return res.status(404).send()
        }

        res.send(relation)
    } catch (e) {
        res.status(500).send()
    }
})


module.exports = router;