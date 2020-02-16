const mongoose = require('mongoose');

const Bank = mongoose.model('Bank', {
    code: {
        type: String,
        trim: true,
        required: true,
        minlength:3,
        maxlength:6
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength:6
    },
});


module.exports = Bank;





