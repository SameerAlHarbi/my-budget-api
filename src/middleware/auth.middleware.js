const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'my_budget_key');
        const user = await User.findOne({_id: decoded._id, 'tokens.token': token});
        if(!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.!'})
    }

    next(); 
}

module.exports = auth;
