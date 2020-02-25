const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,       
        minlength:3,
        maxlength:6,
        touppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength:6
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    },
    owner: 
    {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;