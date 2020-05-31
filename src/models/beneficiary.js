const mongoose = require('mongoose');

const Beneficiary = mongoose.model('Beneficiary', {
    name: {
        type: String,
        required: [true, 'Name is required!'],
        trim: true
    },
    relationType: {
        type: String,
        enum: ['Family', 'Father', 'Mother', 'Brother', 'Sister', 'Frind', 'Other'],
        required: true,
    }
})

module.exports = Beneficiary;