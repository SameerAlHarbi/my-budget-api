const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
        minlength: 4
    }, email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // validate(email) {
        //     if(!validator.isEmail(value)) {
        //         throw new Error('Invalid email')
        //     }
        // }
    }, password:{
        type: String,
        trim: true,
        require: true,
        minlength: 7,
    }
});

userSchema.pre('save', async function(next) {
    const user = this;

    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;