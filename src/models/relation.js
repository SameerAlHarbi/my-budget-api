const mongoose = require('mongoose');

const Relation = mongoose.model('Relation', {
    name: {
        type: String,
        required: true,
        trim: true
    }
});

module.exports = Relation;