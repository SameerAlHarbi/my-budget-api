const mongoose = require('mongoose');

const bankSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,  
        minlength:3,
        maxlength:6,
        trim: true, 
        uppercase: true
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
    },
    logo: {
        type: Buffer
    }
}, {
    timestamps: true
});

bankSchema.pre('save', async function(next) {
    const bank = this;

    if(bank.isModified('code')) {
        const bankByCode = await Bank.findOne({ code: bank.code, owner: bank.owner });
        if(bankByCode && bankByCode.id !== bank.id){
            throw new Error('Bank code Duplicated!');
        }
    }

    next();
});

const Bank = mongoose.model('Bank', bankSchema);

module.exports = Bank;